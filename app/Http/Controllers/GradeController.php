<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGradeRequest;
use App\Http\Requests\UpdateGradeRequest;
use App\Models\Grade;
use App\Models\Student;
use App\Models\Subject;
use App\Models\TeacherSubject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GradeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $query = Grade::with(['student.schoolClass', 'subject', 'teacher'])
            ->latest('created_at');

        // Filter by teacher for non-admin users
        if (!$user->isAdmin()) {
            $query->where('teacher_id', $user->id);
        }

        // Apply filters
        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        if ($request->filled('class_id')) {
            $query->whereHas('student', function($q) use ($request) {
                $q->where('class_id', $request->class_id);
            });
        }

        if ($request->filled('semester')) {
            $query->where('semester', $request->semester);
        }

        if ($request->filled('academic_year')) {
            $query->where('academic_year', $request->academic_year);
        }

        if ($request->filled('grade_type')) {
            $query->where('grade_type', $request->grade_type);
        }

        $grades = $query->paginate(15)->withQueryString();

        // Get filter options
        $subjects = $user->isAdmin() 
            ? Subject::where('is_active', true)->get(['id', 'name', 'code'])
            : $user->teacherSubjects()->with('subject')->get()->pluck('subject');

        return Inertia::render('grades/index', [
            'grades' => $grades,
            'subjects' => $subjects,
            'filters' => $request->only(['subject_id', 'class_id', 'semester', 'academic_year', 'grade_type']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $user = Auth::user();
        
        if (!$user->isTeacher() && !$user->isAdmin()) {
            abort(403, 'Unauthorized');
        }

        // Get teacher subjects
        $currentYear = date('Y');
        $academicYear = $currentYear . '/' . ($currentYear + 1);

        $teacherSubjects = $user->teacherSubjects()
            ->with(['subject', 'schoolClass.students' => function($query) {
                $query->where('is_active', true)->orderBy('name');
            }])
            ->where('academic_year', $academicYear)
            ->get();

        $selectedSubject = null;
        $selectedClass = null;
        $students = collect();

        if ($request->filled('subject_id') && $request->filled('class_id')) {
            /** @var \App\Models\TeacherSubject|null $teacherSubject */
            $teacherSubject = $teacherSubjects->where('subject_id', $request->subject_id)
                ->where('class_id', $request->class_id)
                ->first();

            if ($teacherSubject) {
                $selectedSubject = $teacherSubject->subject;
                $selectedClass = $teacherSubject->schoolClass;
                $students = $selectedClass->students()->where('is_active', true)->get();

                // Get existing grades for selected parameters
                $existingGrades = collect();
                if ($request->filled('semester') && $request->filled('grade_type')) {
                    $existingGrades = Grade::where('subject_id', $selectedSubject->id)
                        ->where('semester', $request->semester)
                        ->where('academic_year', $academicYear)
                        ->where('grade_type', $request->grade_type)
                        ->whereIn('student_id', $students->pluck('id'))
                        ->get()
                        ->keyBy('student_id');
                }

                $students = $students->map(function($student) use ($existingGrades) {
                    /** @var \App\Models\Student $student */
                    $student->setAttribute('existingGrade', $existingGrades->get($student->id));
                    return $student;
                });
            }
        }

        return Inertia::render('grades/create', [
            'teacherSubjects' => $teacherSubjects->map(function($ts) {
                /** @var \App\Models\TeacherSubject $ts */
                return [
                    'id' => $ts->id,
                    'subject_id' => $ts->subject_id,
                    'class_id' => $ts->class_id,
                    'subject' => $ts->subject,
                    'class' => $ts->schoolClass,
                ];
            }),
            'selectedSubject' => $selectedSubject,
            'selectedClass' => $selectedClass,
            'students' => $students,
            'academicYear' => $academicYear,
            'filters' => $request->only(['subject_id', 'class_id', 'semester', 'grade_type']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGradeRequest $request)
    {
        $user = Auth::user();
        
        if (!$user->isTeacher() && !$user->isAdmin()) {
            abort(403, 'Unauthorized');
        }

        $gradeData = $request->validated();
        
        foreach ($gradeData['grades'] as $grade) {
            Grade::updateOrCreate([
                'student_id' => $grade['student_id'],
                'subject_id' => $gradeData['subject_id'],
                'semester' => $gradeData['semester'],
                'academic_year' => $gradeData['academic_year'],
                'grade_type' => $gradeData['grade_type'],
            ], [
                'teacher_id' => $user->id,
                'score' => $grade['score'],
                'notes' => $grade['notes'] ?? null,
            ]);
        }

        return redirect()->route('grades.index')
            ->with('success', 'Nilai berhasil disimpan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Grade $grade)
    {
        $user = Auth::user();
        
        if (!$user->isAdmin() && $grade->teacher_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $grade->load(['student.schoolClass', 'subject', 'teacher']);

        return Inertia::render('grades/show', [
            'grade' => $grade,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Grade $grade)
    {
        $user = Auth::user();
        
        if (!$user->isAdmin() && $grade->teacher_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $grade->load(['student.schoolClass', 'subject']);

        return Inertia::render('grades/edit', [
            'grade' => $grade,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGradeRequest $request, Grade $grade)
    {
        $user = Auth::user();
        
        if (!$user->isAdmin() && $grade->teacher_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $grade->update($request->validated());

        return redirect()->route('grades.show', $grade)
            ->with('success', 'Nilai berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Grade $grade)
    {
        $user = Auth::user();
        
        if (!$user->isAdmin() && $grade->teacher_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $grade->delete();

        return redirect()->route('grades.index')
            ->with('success', 'Nilai berhasil dihapus.');
    }
}