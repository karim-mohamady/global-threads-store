<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('banner_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('banner_id')->constrained('banners')->cascadeOnDelete();
            $table->string('locale');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['banner_id', 'locale']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('banner_translations');
    }
};