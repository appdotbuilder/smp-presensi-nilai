<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSubjectRequest;
use App\Http\Requests\UpdateSubjectRequest;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if (!$user->isAdmin()) {
            abort(403, 'Akses ditolak. Hanya admin yang dapat mengelola mata pelajaran.');
        }

        $query = Subject::with(['teacherSubjects.teacher', 'teacherSubjects.schoolClass'])
            ->withCount('teacherSubjects')
            ->latest();

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $subjects = $query->paginate(15)->withQueryString();

        return Inertia::render('subjects/index', [
            'subjects' => $subjects,
            'filters' => $request->only(['search', 'is_active']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();
        
        if (!$user->isAdmin()) {
            abort(403, 'Akses ditolak. Hanya admin yang dapat mengelola mata pelajaran.');
        }

        return Inertia::render('subjects/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSubjectRequest $request)
    {
        $user = Auth::user();
        
        if (!$user->isAdmin()) {
            abort(403, 'Akses ditolak. Hanya admin yang dapat mengelola mata pelajaran.');
        }

        $subject = Subject::create($request->validated());

        return redirect()->route('subjects.show', $subject)
            ->with('success', 'Mata pelajaran berhasil dibuat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Subject $subject)
    {
        $user = Auth::user();
        
        if (!$user->isAdmin()) {
            abort(403, 'Akses ditolak. Hanya admin yang dapat mengelola mata pelajaran.');
        }

        $subject->load([
            'teacherSubjects.teacher',
            'teacherSubjects.schoolClass',
            'grades' => function($query) {
                $query->with(['student', 'teacher'])->latest();
            },
            'attendances' => function($query) {
                $query->with(['student', 'teacher'])->latest();
            }
        ]);

        return Inertia::render('subjects/show', [
            'subject' => $subject,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Subject $subject)
    {
        $user = Auth::user();
        
        if (!$user->isAdmin()) {
            abort(403, 'Akses ditolak. Hanya admin yang dapat mengelola mata pelajaran.');
        }

        return Inertia::render('subjects/edit', [
            'subject' => $subject,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSubjectRequest $request, Subject $subject)
    {
        $user = Auth::user();
        
        if (!$user->isAdmin()) {
            abort(403, 'Akses ditolak. Hanya admin yang dapat mengelola mata pelajaran.');
        }

        $subject->update($request->validated());

        return redirect()->route('subjects.show', $subject)
            ->with('success', 'Mata pelajaran berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subject $subject)
    {
        $user = Auth::user();
        
        if (!$user->isAdmin()) {
            abort(403, 'Akses ditolak. Hanya admin yang dapat mengelola mata pelajaran.');
        }

        // Check if subject has related data
        if ($subject->teacherSubjects()->exists() || $subject->grades()->exists() || $subject->attendances()->exists()) {
            return redirect()->back()
                ->with('error', 'Mata pelajaran tidak dapat dihapus karena masih memiliki data terkait.');
        }

        $subject->delete();

        return redirect()->route('subjects.index')
            ->with('success', 'Mata pelajaran berhasil dihapus.');
    }
}