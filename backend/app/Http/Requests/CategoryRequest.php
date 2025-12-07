<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'parent_id' => 'nullable|exists:categories,id',
            'slug' => 'required|string|unique:categories,slug,' . $this->category?->id,
            'image_url' => 'nullable|url',
            'sort_order' => 'integer|min:0',
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
