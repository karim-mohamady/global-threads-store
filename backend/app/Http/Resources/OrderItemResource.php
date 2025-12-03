<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'product_id' => $this->product_id,
            'product_name' => $this->product_name,
            'quantity' => $this->quantity,
            'price' => number_format($this->price, 2),
            'total' => number_format($this->total, 2),
            'variant_options' => $this->variant_options,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}