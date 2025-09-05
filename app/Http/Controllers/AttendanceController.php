<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAttendanceRequest;
use App\Http\Requests\UpdateAttendanceRequest;
use App\Models\Attendance;
use App\Models\Student;
use App\Models\Subject;
use App\Models\TeacherSubject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $query = Attendance::with(['student', 'subject', 'teacher'])
            ->latest('date');

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

        if ($request->filled('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $attendances = $query->paginate(15)->withQueryString();

        // Get filter options
        $subjects = $user->isAdmin() 
            ? Subject::where('is_active', true)->get(['id', 'name', 'code'])
            : $user->teacherSubjects()->with('subject')->get()->pluck('subject');

        return Inertia::render('attendances/index', [
            'attendances' => $attendances,
            'subjects' => $subjects,
            'filters' => $request->only(['subject_id', 'class_id', 'date', 'status']),
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
        $teacherSubjects = $user->teacherSubjects()
            ->with(['subject', 'schoolClass.students' => function($query) {
                $query->where('is_active', true)->orderBy('name');
            }])
            ->where('academic_year', date('Y') . '/' . (date('Y') + 1))
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

                // Check if attendance already exists for today
                $existingAttendances = Attendance::where('subject_id', $selectedSubject->id)
                    ->whereIn('student_id', $students->pluck('id'))
                    ->whereDate('date', $request->get('date', today()))
                    ->pluck('student_id')
                    ->toArray();

                $students = $students->map(function($student) use ($existingAttendances) {
                    /** @var \App\Models\Student $student */
                    $student->setAttribute('hasAttendance', in_array($student->id, $existingAttendances));
                    return $student;
                });
            }
        }

        return Inertia::render('attendances/create', [
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
            'date' => $request->get('date', today()->format('Y-m-d')),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttendanceRequest $request)
    {
        $user = Auth::user();
        
        if (!$user->isTeacher() && !$user->isAdmin()) {
            abort(403, 'Unauthorized');
        }

        $attendanceData = $request->validated();
        
        foreach ($attendanceData['attendances'] as $attendance) {
            Attendance::updateOrCreate([
                'student_id' => $attendance['student_id'],
                'subject_id' => $attendanceData['subject_id'],
                'date' => $attendanceData['date'],
            ], [
                'teacher_id' => $user->id,
                'status' => $attendance['status'],
                'notes' => $attendance['notes'] ?? null,
            ]);
        }

        return redirect()->route('attendances.index')
            ->with('success', 'Presensi berhasil disimpan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendance $attendance)
    {
        $user = Auth::user();
        
        if (!$user->isAdmin() && $attendance->teacher_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $attendance->load(['student.schoolClass', 'subject', 'teacher']);

        return Inertia::render('attendances/show', [
            'attendance' => $attendance,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attendance $attendance)
    {
        $user = Auth::user();
        
        if (!$user->isAdmin() && $attendance->teacher_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $attendance->load(['student.schoolClass', 'subject']);

        return Inertia::render('attendances/edit', [
            'attendance' => $attendance,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttendanceRequest $request, Attendance $attendance)
    {
        $user = Auth::user();
        
        if (!$user->isAdmin() && $attendance->teacher_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $attendance->update($request->validated());

        return redirect()->route('attendances.show', $attendance)
            ->with('success', 'Presensi berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendance $attendance)
    {
        $user = Auth::user();
        
        if (!$user->isAdmin() && $attendance->teacher_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $attendance->delete();

        return redirect()->route('attendances.index')
            ->with('success', 'Presensi berhasil dihapus.');
    }
}