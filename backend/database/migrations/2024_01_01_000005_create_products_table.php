<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('sku')->unique();
            $table->decimal('price', 10, 2);
            $table->decimal('cost', 10, 2)->nullable();
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->integer('minimum_stock')->default(5);
            $table->string('image_url')->nullable();
            $table->json('images')->nullable();
            $table->integer('views')->default(0);
            $table->decimal('average_rating', 3, 2)->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('category_id');
            $table->index('sku');
            $table->index('is_featured');
            $table->fullText(['sku']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};