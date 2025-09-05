<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attendance>
 */
class AttendanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'student_id' => optional(Student::where('is_active', true)->inRandomOrder()->first())->id ?? Student::factory(),
            'subject_id' => optional(Subject::where('is_active', true)->inRandomOrder()->first())->id ?? Subject::factory(),
            'teacher_id' => optional(User::where('role', 'guru')->inRandomOrder()->first())->id ?? User::factory()->teacher(),
            'date' => fake()->dateTimeBetween('-30 days', 'now')->format('Y-m-d'),
            'status' => fake()->randomElement(['hadir', 'sakit', 'izin', 'alfa']),
            'notes' => fake()->optional(0.3)->sentence(),
        ];
    }

    /**
     * Set attendance as present.
     */
    public function present(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'hadir',
            'notes' => null,
        ]);
    }

    /**
     * Set attendance as sick.
     */
    public function sick(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sakit',
            'notes' => fake()->optional()->sentence(),
        ]);
    }

    /**
     * Set attendance as excused.
     */
    public function excused(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'izin',
            'notes' => fake()->optional()->sentence(),
        ]);
    }

    /**
     * Set attendance as absent.
     */
    public function absent(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'alfa',
            'notes' => fake()->optional()->sentence(),
        ]);
    }

    /**
     * Set specific date.
     */
    public function onDate(string $date): static
    {
        return $this->state(fn (array $attributes) => [
            'date' => $date,
        ]);
    }
}