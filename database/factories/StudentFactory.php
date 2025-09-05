<?php

namespace Database\Factories;

use App\Models\SchoolClass;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = fake()->randomElement(['L', 'P']);
        $firstName = $gender === 'L' ? fake('id_ID')->firstNameMale : fake('id_ID')->firstNameFemale;
        $lastName = fake('id_ID')->lastName;
        $name = $firstName . ' ' . $lastName;
        
        return [
            'nis' => fake()->unique()->numerify('2024######'),
            'name' => $name,
            'gender' => $gender,
            'birth_date' => fake()->dateTimeBetween('-16 years', '-12 years')->format('Y-m-d'),
            'birth_place' => fake('id_ID')->city,
            'address' => fake('id_ID')->address,
            'phone' => fake()->optional()->phoneNumber,
            'parent_name' => fake('id_ID')->name,
            'parent_phone' => fake()->phoneNumber,
            'class_id' => optional(SchoolClass::where('is_active', true)->inRandomOrder()->first())->id,
            'is_active' => fake()->boolean(95),
        ];
    }

    /**
     * Indicate that the student is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Set specific gender.
     */
    public function male(): static
    {
        return $this->state(fn (array $attributes) => [
            'gender' => 'L',
            'name' => fake('id_ID')->firstNameMale . ' ' . fake('id_ID')->lastName,
        ]);
    }

    /**
     * Set specific gender.
     */
    public function female(): static
    {
        return $this->state(fn (array $attributes) => [
            'gender' => 'P',
            'name' => fake('id_ID')->firstNameFemale . ' ' . fake('id_ID')->lastName,
        ]);
    }

    /**
     * Assign to specific class.
     */
    public function inClass(SchoolClass $class): static
    {
        return $this->state(fn (array $attributes) => [
            'class_id' => $class->id,
        ]);
    }
}