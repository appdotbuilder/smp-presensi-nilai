<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\Student;
use App\Models\SchoolClass;
use Inertia\Inertia;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Display a listing of students.
     */
    public function index(Request $request)
    {
        $query = Student::with(['schoolClass'])
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('nis', 'like', "%{$search}%");
            })
            ->when($request->class_id, function ($query, $classId) {
                $query->where('class_id', $classId);
            })
            ->when($request->filter === 'active', function ($query) {
                $query->where('is_active', true);
            })
            ->when($request->filter === 'inactive', function ($query) {
                $query->where('is_active', false);
            });

        $students = $query->latest()->paginate(15)->withQueryString();

        $classes = SchoolClass::active()
            ->orderBy('grade')
            ->orderBy('name')
            ->get(['id', 'name', 'grade']);

        return Inertia::render('students/index', [
            'students' => $students,
            'classes' => $classes,
            'filters' => $request->only(['search', 'class_id', 'filter']),
        ]);
    }

    /**
     * Show the form for creating a new student.
     */
    public function create()
    {
        $classes = SchoolClass::active()
            ->orderBy('grade')
            ->orderBy('name')
            ->get(['id', 'name', 'grade', 'max_students'])
;

        return Inertia::render('students/create', [
            'classes' => $classes,
        ]);
    }

    /**
     * Store a newly created student.
     */
    public function store(StoreStudentRequest $request)
    {
        $student = Student::create($request->validated());

        return redirect()->route('students.show', $student)
            ->with('success', 'Data siswa berhasil ditambahkan.');
    }

    /**
     * Display the specified student.
     */
    public function show(Student $student)
    {
        $student->load(['schoolClass.homeroomTeacher']);

        // Get recent attendance (last 10 records)
        $recentAttendances = $student->attendances()
            ->with(['subject', 'teacher'])
            ->latest('date')
            ->take(10)
            ->get();

        // Get recent grades (last 10 records)
        $recentGrades = $student->grades()
            ->with(['subject', 'teacher'])
            ->latest()
            ->take(10)
            ->get();

        // Get attendance summary for current month
        $currentMonth = now()->format('Y-m');
        $monthlyAttendance = $student->attendances()
            ->whereRaw('DATE_FORMAT(date, "%Y-%m") = ?', [$currentMonth])
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return Inertia::render('students/show', [
            'student' => $student,
            'recentAttendances' => $recentAttendances,
            'recentGrades' => $recentGrades,
            'monthlyAttendance' => $monthlyAttendance,
        ]);
    }

    /**
     * Show the form for editing the student.
     */
    public function edit(Student $student)
    {
        $classes = SchoolClass::active()
            ->orderBy('grade')
            ->orderBy('name')
            ->get(['id', 'name', 'grade', 'max_students'])
;

        return Inertia::render('students/edit', [
            'student' => $student,
            'classes' => $classes,
        ]);
    }

    /**
     * Update the specified student.
     */
    public function update(UpdateStudentRequest $request, Student $student)
    {
        $student->update($request->validated());

        return redirect()->route('students.show', $student)
            ->with('success', 'Data siswa berhasil diperbarui.');
    }

    /**
     * Remove the specified student.
     */
    public function destroy(Student $student)
    {
        // Soft delete by setting is_active to false
        $student->update(['is_active' => false]);

        return redirect()->route('students.index')
            ->with('success', 'Siswa berhasil dinonaktifkan.');
    }
}