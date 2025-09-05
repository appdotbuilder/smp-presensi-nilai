<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->enum('semester', ['1', '2'])->comment('Semester 1 atau 2');
            $table->string('academic_year')->comment('Tahun ajaran (contoh: 2024/2025)');
            $table->enum('grade_type', ['harian', 'uts', 'uas'])->comment('Jenis nilai');
            $table->decimal('score', 5, 2)->comment('Nilai (0-100)');
            $table->text('notes')->nullable()->comment('Catatan nilai');
            $table->timestamps();
            
            $table->index(['student_id', 'subject_id', 'semester', 'academic_year']);
            $table->index(['grade_type', 'semester', 'academic_year']);
            $table->index('score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};