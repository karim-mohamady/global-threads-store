<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CouponResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'description' => $this->description,
            'discount_type' => $this->discount_type,
            'discount_value' => $this->discount_value,
            'minimum_purchase' => $this->minimum_purchase,
            'usage_limit' => $this->usage_limit,
            'usage_count' => $this->usage_count,
            'usage_limit_per_user' => $this->usage_limit_per_user,
            'valid_from' => $this->valid_from?->format('Y-m-d'),
            'valid_until' => $this->valid_until?->format('Y-m-d'),
            'is_active' => $this->is_active,
            'is_valid' => $this->isValid(),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}