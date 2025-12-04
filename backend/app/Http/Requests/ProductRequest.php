<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'sku' => 'required|string|unique:products,sku,' . $this->product?->id,
            'price' => 'required|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'stock_quantity' => 'required|integer|min:0',
            'minimum_stock' => 'nullable|integer|min:0',
            'image_url' => 'nullable|url',
            'images' => 'nullable|json',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'translations' => 'required|array',
            'translations.en' => 'required|array',
            'translations.en.name' => 'required|string|max:255',
            'translations.en.description' => 'nullable|string',
            'translations.ar' => 'nullable|array',
            'translations.ar.name' => 'nullable|string|max:255',
            'translations.ar.description' => 'nullable|string',
        ];
    }
}
