<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = $this->faker->word();
        $price = $this->faker->randomFloat(2, 10, 500);

        return [
            'category_id' => Category::factory(),
            'sku' => Str::upper(Str::random(8)),
            'price' => $price,
            'cost' => $price * 0.6,
            'discount_price' => $this->faker->boolean(30) ? $price * 0.8 : null,
            'stock_quantity' => $this->faker->numberBetween(0, 1000),
            'minimum_stock' => 5,
            'image_url' => $this->faker->imageUrl(640, 480),
            'views' => $this->faker->numberBetween(0, 1000),
            'average_rating' => $this->faker->randomFloat(2, 1, 5),
            'is_featured' => $this->faker->boolean(20),
            'is_active' => true,
        ];
    }
}