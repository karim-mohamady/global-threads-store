<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'sku' => $this->sku,
            'name' => $this->getTranslation('name', app()->getLocale()),
            'name_en' => $this->getTranslation('name', 'en'),
            'name_ar' => $this->getTranslation('name', 'ar'),
            'description' => $this->getTranslation('description', app()->getLocale()),
            'short_description' => $this->getTranslation('short_description', app()->getLocale()),
            'price' => $this->price,
            'cost' => $this->cost,
            'discount_price' => $this->discount_price,
            'discount_percentage' => $this->getDiscountPercentage(),
            'display_price' => $this->getDisplayPrice(),
            'stock_quantity' => $this->stock_quantity,
            'is_in_stock' => $this->stock_quantity > 0,
            'is_low_stock' => $this->isLowStock(),
            'image_url' => $this->image_url,
            'images' => $this->images,
            'views' => $this->views,
            'average_rating' => $this->average_rating,
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,
            'variants' => ProductVariantResource::collection($this->whenLoaded('variants')),
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}