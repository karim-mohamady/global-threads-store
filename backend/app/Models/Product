<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;

class Product extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'category_id',
        'sku',
        'price',
        'cost',
        'discount_price',
        'stock_quantity',
        'minimum_stock',
        'image_url',
        'images',
        'views',
        'average_rating',
        'is_featured',
        'is_active',
        'name',
        'description',
        'short_description',
    ];

    public array $translatable = ['name', 'description', 'short_description'];

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'price' => 'decimal:2',
            'cost' => 'decimal:2',
            'discount_price' => 'decimal:2',
            'average_rating' => 'decimal:2',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory(Builder $query, int $categoryId): Builder
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeSearch(Builder $query, string $term): Builder
    {
        return $query->where('sku', 'like', "%{$term}%");
    }

    public function getDiscountPercentage(): ? float
    {
        if (! $this->discount_price || $this->discount_price >= $this->price) {
            return null;
        }

        return round(((($this->price - $this->discount_price) / $this->price) * 100), 2);
    }

    public function getDisplayPrice(): float
    {
        return $this->discount_price ?? $this->price;
    }

    public function isLowStock(): bool
    {
        return $this->stock_quantity <= $this->minimum_stock;
    }
}