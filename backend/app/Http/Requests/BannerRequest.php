<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BannerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'image_url' => 'required|url',
            'link' => 'nullable|url',
            'position' => 'required|string|max:50',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after:valid_from',
            'translations' => 'array',
            'translations.en' => 'array',
            'translations.en.title' => 'nullable|string|max:255',
            'translations.en.description' => 'nullable|string',
            'translations.ar' => 'array',
            'translations.ar.title' => 'nullable|string|max:255',
            'translations.ar.description' => 'nullable|string',
        ];
    }
}
