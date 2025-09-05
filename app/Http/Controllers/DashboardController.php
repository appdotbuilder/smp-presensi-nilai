<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Subject;
use App\Models\SchoolClass;
use App\Models\User;
use App\Models\Attendance;
use App\Models\Grade;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Display the main dashboard.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return Inertia::render('welcome', [
                'stats' => [
                    'students' => Student::active()->count(),
                    'teachers' => User::teachers()->count(),
                    'subjects' => Subject::active()->count(),
                    'classes' => SchoolClass::active()->count(),
                ]
            ]);
        }

        // Get current academic year (simple logic)
        $currentYear = date('Y');
        $academicYear = $currentYear . '/' . ($currentYear + 1);

        if ($user->isAdmin()) {
            // Admin dashboard data
            $stats = [
                'total_students' => Student::where('is_active', true)->count(),
                'total_teachers' => User::where('role', 'guru')->count(),
                'total_subjects' => Subject::where('is_active', true)->count(),
                'total_classes' => SchoolClass::where('is_active', true)->count(),
            ];

            $recentStudents = Student::with('schoolClass')
                ->where('is_active', true)
                ->latest()
                ->take(5)
                ->get()
                ->toArray();

            $classesWithCapacity = SchoolClass::with('homeroomTeacher')
                ->withCount(['students as students_count' => function($query) {
                    $query->where('is_active', true);
                }])
                ->where('is_active', true)
                ->get()
                ->map(function($class) {
                    return [
                        'id' => $class->id,
                        'name' => $class->name,
                        'grade' => $class->grade,
                        'students_count' => $class->students_count ?? 0,
                        'max_students' => $class->max_students,
                        'capacity_percentage' => round((($class->students_count ?? 0) / $class->max_students) * 100),
                        'homeroom_teacher' => $class->homeroomTeacher?->name,
                    ];
                });

            return Inertia::render('dashboard', [
                'userRole' => 'admin',
                'stats' => $stats,
                'recentStudents' => $recentStudents,
                'classesWithCapacity' => $classesWithCapacity,
                'academicYear' => $academicYear,
            ]);
        } else {
            // Teacher dashboard data
            $teacherSubjects = $user->teacherSubjects()
                ->with(['subject', 'schoolClass'])
                ->where('academic_year', $academicYear)
                ->get();

            $totalStudents = 0;
            foreach ($teacherSubjects as $ts) {
                /** @var \App\Models\TeacherSubject $ts */
                $totalStudents += $ts->schoolClass->students()->where('is_active', true)->count();
            }

            // Get recent attendance records
            $recentAttendances = Attendance::with(['student', 'subject'])
                ->where('teacher_id', $user->id)
                ->whereDate('date', '>=', now()->subDays(7))
                ->latest('date')
                ->take(10)
                ->get()
                ->toArray();

            // Get attendance summary for today
            $todayAttendance = Attendance::where('teacher_id', $user->id)
                ->whereDate('date', today())
                ->selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status')
                ->toArray();

            $stats = [
                'assigned_classes' => $teacherSubjects->count(),
                'total_students' => $totalStudents,
                'subjects_taught' => $teacherSubjects->pluck('subject')->unique('id')->count(),
                'today_attendances' => array_sum($todayAttendance),
            ];

            return Inertia::render('dashboard', [
                'userRole' => 'teacher',
                'stats' => $stats,
                'teacherSubjects' => $teacherSubjects->map(function($ts) {
                    /** @var \App\Models\TeacherSubject $ts */
                    return [
                        'id' => $ts->id,
                        'subject' => $ts->subject->toArray(),
                        'class' => $ts->schoolClass->toArray(),
                        'students_count' => $ts->schoolClass->students()->where('is_active', true)->count(),
                    ];
                })->toArray(),
                'recentAttendances' => $recentAttendances,
                'todayAttendance' => $todayAttendance,
                'academicYear' => $academicYear,
            ]);
        }
    }


}