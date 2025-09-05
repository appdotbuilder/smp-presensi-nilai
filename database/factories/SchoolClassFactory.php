<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SchoolClass>
 */
class SchoolClassFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $grade = fake()->randomElement(['7', '8', '9']);
        $classLetter = fake()->randomElement(['A', 'B', 'C', 'D', 'E']);
        $currentYear = date('Y');
        
        return [
            'name' => $grade . $classLetter,
            'grade' => $grade,
            'academic_year' => $currentYear . '/' . ($currentYear + 1),
            'homeroom_teacher_id' => optional(User::where('role', 'guru')->inRandomOrder()->first())->id,
            'max_students' => fake()->numberBetween(25, 35),
            'is_active' => fake()->boolean(95),
        ];
    }

    /**
     * Indicate that the class is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Set specific grade.
     */
    public function grade(string $grade): static
    {
        return $this->state(fn (array $attributes) => [
            'grade' => $grade,
            'name' => $grade . fake()->randomElement(['A', 'B', 'C', 'D']),
        ]);
    }
}