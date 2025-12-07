<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_products(): void
    {
        Product::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/products');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'price'],
                ],
            ]);
    }

    public function test_can_show_single_product(): void
    {
        $product = Product::factory()->create();

        $response = $this->getJson("/api/v1/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => ['id', 'name', 'price'],
            ]);
    }

    public function test_admin_can_create_product(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = Category::factory()->create();
        $token = $admin->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/products', [
                'sku' => 'TEST-001',
                'price' => 99.99,
                'category_id' => $category->id,
                'stock_quantity' => 100,
                'translations' => [
                    'en' => [
                        'name' => 'Test Product',
                        'description' => 'Test description',
                    ],
                    'ar' => [
                        'name' => 'منتج تجريبي',
                        'description' => 'وصف تجريبي',
                    ],
                ],
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'product',
            ]);
    }

    public function test_non_admin_cannot_create_product(): void
    {
        $user = User::factory()->create(['role' => 'customer']);
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/products', [
                'name' => 'Test Product',
                'price' => 99.99,
            ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_update_product(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $product = Product::factory()->create();
        $token = $admin->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson("/api/v1/products/{$product->id}", [
                'sku' => $product->sku,
                'price' => 149.99,
                'category_id' => $product->category_id,
                'stock_quantity' => $product->stock_quantity,
                'translations' => [
                    'en' => [
                        'name' => 'Updated Product',
                        'description' => 'Updated description',
                    ],
                ],
            ]);

        $response->assertStatus(200);
    }

    public function test_admin_can_delete_product(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $product = Product::factory()->create();
        $token = $admin->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson("/api/v1/products/{$product->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }
}
