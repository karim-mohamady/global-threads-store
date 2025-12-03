<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'shipping_address_id' => 'required|exists:addresses,id',
            'billing_address_id' => 'required|exists:addresses,id',
            'payment_method' => 'required|in:credit_card,paypal,bank_transfer,cod',
            'coupon_code' => 'nullable|string|exists:coupons,code',
            'notes' => 'nullable|string',
        ];
    }
}