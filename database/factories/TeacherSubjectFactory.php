<?php

namespace Database\Factories;

use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TeacherSubject>
 */
class TeacherSubjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $currentYear = date('Y');
        
        return [
            'teacher_id' => optional(User::where('role', 'guru')->inRandomOrder()->first())->id ?? User::factory()->teacher(),
            'subject_id' => optional(Subject::where('is_active', true)->inRandomOrder()->first())->id ?? Subject::factory(),
            'class_id' => optional(SchoolClass::where('is_active', true)->inRandomOrder()->first())->id ?? SchoolClass::factory(),
            'academic_year' => $currentYear . '/' . ($currentYear + 1),
        ];
    }

    /**
     * Set specific academic year.
     */
    public function academicYear(string $year): static
    {
        return $this->state(fn (array $attributes) => [
            'academic_year' => $year,
        ]);
    }

    /**
     * Assign to specific teacher.
     */
    public function forTeacher(User $teacher): static
    {
        return $this->state(fn (array $attributes) => [
            'teacher_id' => $teacher->id,
        ]);
    }

    /**
     * Assign to specific class.
     */
    public function forClass(SchoolClass $class): static
    {
        return $this->state(fn (array $attributes) => [
            'class_id' => $class->id,
        ]);
    }

    /**
     * Assign specific subject.
     */
    public function subject(Subject $subject): static
    {
        return $this->state(fn (array $attributes) => [
            'subject_id' => $subject->id,
        ]);
    }
}