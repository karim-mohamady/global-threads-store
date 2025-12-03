<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderAddress extends Model
{
    protected $fillable = [
        'order_id',
        'type',
        'first_name',
        'last_name',
        'street_address',
        'city',
        'state',
        'postal_code',
        'country',
        'phone',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getFullAddressAttribute(): string
    {
        return "{$this->street_address}, {$this->city}, {$this->state} {$this->postal_code}, {$this->country}";
    }
}