<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Carbon\Carbon;

class Banner extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'image_url',
        'link',
        'position',
        'sort_order',
        'is_active',
        'valid_from',
        'valid_until',
        'title',
        'description',
    ];

    public array $translatable = ['title', 'description'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'valid_from' => 'date',
            'valid_until' => 'date',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeByPosition(Builder $query, string $position): Builder
    {
        return $query->where('position', $position);
    }

    public function scopeValid(Builder $query): Builder
    {
        $today = Carbon::today();

        return $query->where('is_active', true)
            ->where(function ($q) use ($today) {
                $q->whereNull('valid_from')->orWhere('valid_from', '<=', $today);
            })
            ->where(function ($q) use ($today) {
                $q->whereNull('valid_until')->orWhere('valid_until', '>=', $today);
            })
            ->orderBy('sort_order', 'asc');
    }
}