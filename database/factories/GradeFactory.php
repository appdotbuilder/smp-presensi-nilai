<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Grade>
 */
class GradeFactory extends Factory
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
            'student_id' => optional(Student::where('is_active', true)->inRandomOrder()->first())->id ?? Student::factory(),
            'subject_id' => optional(Subject::where('is_active', true)->inRandomOrder()->first())->id ?? Subject::factory(),
            'teacher_id' => optional(User::where('role', 'guru')->inRandomOrder()->first())->id ?? User::factory()->teacher(),
            'semester' => fake()->randomElement(['1', '2']),
            'academic_year' => $currentYear . '/' . ($currentYear + 1),
            'grade_type' => fake()->randomElement(['harian', 'uts', 'uas']),
            'score' => fake()->numberBetween(60, 100),
            'notes' => fake()->optional(0.2)->sentence(),
        ];
    }

    /**
     * Set grade as daily grade.
     */
    public function daily(): static
    {
        return $this->state(fn (array $attributes) => [
            'grade_type' => 'harian',
            'score' => fake()->numberBetween(65, 95),
        ]);
    }

    /**
     * Set grade as midterm exam.
     */
    public function midterm(): static
    {
        return $this->state(fn (array $attributes) => [
            'grade_type' => 'uts',
            'score' => fake()->numberBetween(60, 90),
        ]);
    }

    /**
     * Set grade as final exam.
     */
    public function finalExam(): static
    {
        return $this->state(fn (array $attributes) => [
            'grade_type' => 'uas',
            'score' => fake()->numberBetween(65, 95),
        ]);
    }

    /**
     * Set high score.
     */
    public function excellent(): static
    {
        return $this->state(fn (array $attributes) => [
            'score' => fake()->numberBetween(90, 100),
            'notes' => 'Nilai sangat baik',
        ]);
    }

    /**
     * Set low score.
     */
    public function needsImprovement(): static
    {
        return $this->state(fn (array $attributes) => [
            'score' => fake()->numberBetween(50, 65),
            'notes' => 'Perlu perbaikan',
        ]);
    }

    /**
     * Set specific semester.
     */
    public function semester(string $semester): static
    {
        return $this->state(fn (array $attributes) => [
            'semester' => $semester,
        ]);
    }
}