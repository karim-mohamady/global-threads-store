<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'attribute_name' => $this->attribute_name,
            'attribute_value' => $this->attribute_value,
            'stock_quantity' => $this->stock_quantity,
            'price_modifier' => $this->price_modifier,
            'final_price' => number_format($this->getFinalPrice(), 2),
            'sku_suffix' => $this->sku_suffix,
            'is_available' => $this->isAvailable(),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}