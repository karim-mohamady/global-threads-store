<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'phone' => $this->faker->phoneNumber(),
            'password' => Hash::make('password'),
            'remember_token' => Str::random(10),
            'date_of_birth' => $this->faker->date(),
            'gender' => $this->faker->randomElement(['male', 'female', 'other']),
            'role' => 'customer',
            'is_active' => true,
        ];
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
        ]);
    }
}