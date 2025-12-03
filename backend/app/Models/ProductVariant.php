<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'attribute_name',
        'attribute_value',
        'stock_quantity',
        'price_modifier',
        'sku_suffix',
    ];

    protected function casts(): array
    {
        return [
            'price_modifier' => 'decimal:2',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getFinalPrice(): float
    {
        $basePrice = $this->product->getDisplayPrice();
        return $basePrice + $this->price_modifier;
    }

    public function isAvailable(): bool
    {
        return $this->stock_quantity > 0;
    }
}