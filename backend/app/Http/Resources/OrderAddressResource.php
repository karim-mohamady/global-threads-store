<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderAddressResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id ?? null,
            'type' => $this->type ?? null,
            'first_name' => $this->first_name ?? null,
            'last_name' => $this->last_name ?? null,
            'full_name' => $this->full_name ?? null,
            'street_address' => $this->street_address ?? null,
            'city' => $this->city ?? null,
            'state' => $this->state ?? null,
            'postal_code' => $this->postal_code ?? null,
            'country' => $this->country ?? null,
            'phone' => $this->phone ?? null,
            'full_address' => $this->full_address ?? null,
        ];
    }
}
