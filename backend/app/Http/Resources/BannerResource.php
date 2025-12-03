<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BannerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'image_url' => $this->image_url,
            'link' => $this->link,
            'title' => $this->getTranslation('title', app()->getLocale()),
            'title_en' => $this->getTranslation('title', 'en'),
            'title_ar' => $this->getTranslation('title', 'ar'),
            'description' => $this->getTranslation('description', app()->getLocale()),
            'position' => $this->position,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
            'valid_from' => $this->valid_from?->format('Y-m-d'),
            'valid_until' => $this->valid_until?->format('Y-m-d'),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}