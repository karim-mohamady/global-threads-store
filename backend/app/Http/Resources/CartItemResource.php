<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'cart_id' => $this->cart_id,
            'product' => new ProductResource($this->whenLoaded('product')),
            'product_id' => $this->product_id,
            'variant' => new ProductVariantResource($this->whenLoaded('variant')),
            'product_variant_id' => $this->product_variant_id,
            'quantity' => $this->quantity,
            'price' => $this->price,
            'total' => number_format($this->getTotal(), 2),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}