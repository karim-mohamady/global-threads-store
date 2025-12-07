<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('attribute_name');
            $table->string('attribute_value');
            $table->integer('stock_quantity')->default(0);
            $table->decimal('price_modifier', 10, 2)->default(0);
            $table->string('sku_suffix')->nullable();
            $table->timestamps();

            $table->index('product_id');
           $table->unique(['product_id', 'attribute_name', 'attribute_value'], 'product_variant_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};