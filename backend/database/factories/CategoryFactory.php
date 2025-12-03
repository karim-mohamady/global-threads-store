<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        $name = $this->faker->word();

        return [
            'slug' => Str::slug($name),
            'image_url' => $this->faker->imageUrl(640, 480),
            'sort_order' => $this->faker->numberBetween(0, 100),
            'is_active' => true,
        ];
    }
}