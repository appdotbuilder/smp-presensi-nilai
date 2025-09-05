<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSchoolClassRequest;
use App\Http\Requests\UpdateSchoolClassRequest;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SchoolClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if (!$user->isAdmin()) {
            abort(403, 'Akses ditolak. Hanya admin yang dapat mengelola kelas.');
        }

        $query = SchoolClass::with(['homeroomTeacher'])
            ->withCount(['students as students_count' => function($query) {
                $query->where('is_active', true);
            }])
            ->latest();

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('grade', 'like', "%{$search}%");
            });
        }

        if ($request->filled('grade')) {
            $query->where('grade', $request->grade);
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $classes = $query->paginate(15)->withQueryString();

        return Inertia::render('classes/index', [
            'classes' => $classes,
            'filters' => $request->only(['search', 'grade', 'is_active']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();
        
        if (!$user->isAdmin()) {
            abort(403, 'Akses ditolak. Hanya admin yang dapat mengelola kelas.');
        }

        $teachers = User::teachers()->orderBy('name')->get(['id', 'name', 'nip']);

        return Inertia::render('classes/create', [
            'teachers' => $teachers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSchoolClassRequest $request)
    {
        $user = Auth::user();
        
        if (!$user->isAdmin()) {
            abort(403, 'Akses ditolak. Hanya admin yang dapat mengelola kelas.');
        }

        $class = SchoolClass::create($request->validated());

        return redirect()->route('classes.show', $class)
            ->with('success', 'Kelas berhasil dibuat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(SchoolClass $class)
    {
        $user = Auth::user();
        
        if (!$user->isAdmin()) {
            abort(403, 'Akses ditolak. Hanya admin yang dapat mengelola kelas.');
        }

        $class->load([
            'homeroomTeacher',
            'students' => function($query) {
                $query->where('is_active', true)->orderBy('name');
            },
            'teacherSubjects.teacher',
            'teacherSubjects.subject'
        ]);

        return Inertia::render('classes/show', [
            'class' => $class,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SchoolClass $class)
    {
        $user = Auth::user();
        
        if (!$user->isAdmin()) {
            abort(403, 'Akses ditolak. Hanya admin yang dapat mengelola kelas.');
        }

        $teachers = User::teachers()->orderBy('name')->get(['id', 'name', 'nip']);

        return Inertia::render('classes/edit', [
            'class' => $class,
            'teachers' => $teachers,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSchoolClassRequest $request, SchoolClass $class)
    {
        $user = Auth::user();
        
        if (!$user->isAdmin()) {
            abort(403, 'Akses ditolak. Hanya admin yang dapat mengelola kelas.');
        }

        $class->update($request->validated());

        return redirect()->route('classes.show', $class)
            ->with('success', 'Kelas berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SchoolClass $class)
    {
        $user = Auth::user();
        
        if (!$user->isAdmin()) {
            abort(403, 'Akses ditolak. Hanya admin yang dapat mengelola kelas.');
        }

        // Check if class has students
        if ($class->students()->where('is_active', true)->exists()) {
            return redirect()->back()
                ->with('error', 'Kelas tidak dapat dihapus karena masih memiliki siswa aktif.');
        }

        // Check if class has teacher subjects
        if ($class->teacherSubjects()->exists()) {
            return redirect()->back()
                ->with('error', 'Kelas tidak dapat dihapus karena masih memiliki mata pelajaran.');
        }

        $class->delete();

        return redirect()->route('classes.index')
            ->with('success', 'Kelas berhasil dihapus.');
    }
}