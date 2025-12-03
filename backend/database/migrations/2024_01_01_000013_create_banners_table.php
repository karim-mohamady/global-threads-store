<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('image_url');
            $table->string('link')->nullable();
            $table->string('position')->default('homepage');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->date('valid_from')->nullable();
            $table->date('valid_until')->nullable();
            $table->timestamps();

            $table->index('position');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};