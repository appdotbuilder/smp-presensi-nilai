<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subject>
 */
class SubjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subjects = [
            ['name' => 'Matematika', 'code' => 'MAT'],
            ['name' => 'Bahasa Indonesia', 'code' => 'IND'],
            ['name' => 'Bahasa Inggris', 'code' => 'ING'],
            ['name' => 'IPA (Ilmu Pengetahuan Alam)', 'code' => 'IPA'],
            ['name' => 'IPS (Ilmu Pengetahuan Sosial)', 'code' => 'IPS'],
            ['name' => 'Pendidikan Agama Islam', 'code' => 'PAI'],
            ['name' => 'Pendidikan Pancasila', 'code' => 'PKN'],
            ['name' => 'Seni Budaya', 'code' => 'SBK'],
            ['name' => 'Pendidikan Jasmani', 'code' => 'PJK'],
            ['name' => 'Prakarya', 'code' => 'PKY'],
            ['name' => 'Teknologi Informasi', 'code' => 'TIK'],
            ['name' => 'Bimbingan Konseling', 'code' => 'BK'],
        ];

        $subject = fake()->randomElement($subjects);

        return [
            'name' => $subject['name'],
            'code' => $subject['code'] . fake()->numberBetween(1, 99),
            'description' => fake()->paragraph(2),
            'is_active' => fake()->boolean(90),
        ];
    }

    /**
     * Indicate that the subject is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}