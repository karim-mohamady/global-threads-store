<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'user_id' => $this->user_id,
            'subtotal' => number_format($this->subtotal, 2),
            'tax_amount' => number_format($this->tax_amount, 2),
            'shipping_cost' => number_format($this->shipping_cost, 2),
            'discount_amount' => number_format($this->discount_amount, 2),
            'total_amount' => number_format($this->total_amount, 2),
            'coupon' => new CouponResource($this->whenLoaded('coupon')),
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'payment_method' => $this->payment_method,
            'payment_reference' => $this->payment_reference,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'shipping_address' => new OrderAddressResource($this->getShippingAddress()),
            'billing_address' => new OrderAddressResource($this->getBillingAddress()),
            'notes' => $this->notes,
            'confirmed_at' => $this->confirmed_at?->format('Y-m-d H:i:s'),
            'shipped_at' => $this->shipped_at?->format('Y-m-d H:i:s'),
            'delivered_at' => $this->delivered_at? ->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}