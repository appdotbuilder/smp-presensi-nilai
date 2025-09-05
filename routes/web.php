<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page - show welcome with stats
Route::get('/', [DashboardController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Admin only routes - authorization check in controllers
    Route::resource('students', \App\Http\Controllers\StudentController::class);
    Route::resource('subjects', \App\Http\Controllers\SubjectController::class);
    Route::resource('classes', \App\Http\Controllers\SchoolClassController::class);
    
    // Teacher and Admin routes - authorization check in controllers
    Route::resource('attendances', \App\Http\Controllers\AttendanceController::class);
    Route::resource('grades', \App\Http\Controllers\GradeController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
