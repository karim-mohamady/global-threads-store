<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'parent_id' => $this->parent_id,
            'slug' => $this->slug,
            'name' => $this->getTranslation('name', app()->getLocale()),
            'name_en' => $this->getTranslation('name', 'en'),
            'name_ar' => $this->getTranslation('name', 'ar'),
            'description' => $this->getTranslation('description', app()->getLocale()),
            'image_url' => $this->image_url,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
            'children' => CategoryResource::collection($this->whenLoaded('children')),
            'products_count' => $this->products_count ??  $this->products()->count(),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}