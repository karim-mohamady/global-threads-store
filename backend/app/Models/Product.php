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

    /**
     * Enhanced search scope - searches by name, description, short_description, and SKU
     * Supports both English and Arabic text
     */
    public function scopeSearch(Builder $query, string $term): Builder
    {
        $term = trim($term);
        
        if (empty($term)) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($term) {
            // Search in SKU
            $q->where('sku', 'like', "%{$term}%");
            
            // Search in JSON translatable fields (name, description, short_description)
            // This works with Spatie's laravel-translatable package
            $q->orWhere('name', 'like', "%{$term}%")
              ->orWhere('description', 'like', "%{$term}%")
              ->orWhere('short_description', 'like', "%{$term}%");
            
            // Also search in category name for related products
            $q->orWhereHas('category', function (Builder $categoryQuery) use ($term) {
                $categoryQuery->where('name', 'like', "%{$term}%");
            });
        });
    }

    /**
     * Scope to filter by price range
     */
    public function scopePriceRange(Builder $query, ?float $min = null, ?float $max = null): Builder
    {
        if ($min !== null) {
            $query->where('price', '>=', $min);
        }
        
        if ($max !== null) {
            $query->where('price', '<=', $max);
        }
        
        return $query;
    }

    /**
     * Scope to filter by color (from variants)
     */
    public function scopeByColor(Builder $query, string $color): Builder
    {
        return $query->whereHas('variants', function (Builder $q) use ($color) {
            $q->where('color', $color);
        });
    }

    /**
     * Scope to filter by size (from variants)
     */
    public function scopeBySize(Builder $query, string $size): Builder
    {
        return $query->whereHas('variants', function (Builder $q) use ($size) {
            $q->where('size', $size);
        });
    }

    /**
     * Scope to filter in-stock products only
     */
    public function scopeInStock(Builder $query): Builder
    {
        return $query->where('stock_quantity', '>', 0);
    }

    public function getDiscountPercentage(): ?float
    {
        if (!$this->discount_price || $this->discount_price >= $this->price) {
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
