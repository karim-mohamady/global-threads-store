<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'description',
        'discount_type',
        'discount_value',
        'minimum_purchase',
        'usage_limit',
        'usage_count',
        'usage_limit_per_user',
        'valid_from',
        'valid_until',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'discount_value' => 'decimal:2',
            'minimum_purchase' => 'decimal:2',
            'valid_from' => 'date',
            'valid_until' => 'date',
        ];
    }

    public function usages(): HasMany
    {
        return $this->hasMany(CouponUsage::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeValid(Builder $query): Builder
    {
        $today = Carbon::today();

        return $query->where('is_active', true)
            ->where(function ($q) use ($today) {
                $q->whereNull('valid_from')->orWhere('valid_from', '<=', $today);
            })
            ->where(function ($q) use ($today) {
                $q->whereNull('valid_until')->orWhere('valid_until', '>=', $today);
            });
    }

    public function isValid(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $today = Carbon::today();

        if ($this->valid_from && $this->valid_from > $today) {
            return false;
        }

        if ($this->valid_until && $this->valid_until < $today) {
            return false;
        }

        if ($this->usage_limit && $this->usage_count >= $this->usage_limit) {
            return false;
        }

        return true;
    }

    public function canBeUsedByUser(User $user): bool
    {
        if (! $this->isValid()) {
            return false;
        }

        if ($this->usage_limit_per_user) {
            $userUsageCount = $this->usages()->where('user_id', $user->id)->count();
            if ($userUsageCount >= $this->usage_limit_per_user) {
                return false;
            }
        }

        return true;
    }

    public function calculateDiscount(float $amount): float
    {
        if ($this->discount_type === 'percentage') {
            return $amount * ($this->discount_value / 100);
        }

        return min($this->discount_value, $amount);
    }
}