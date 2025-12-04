<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\BannerRequest;
use App\Http\Resources\BannerResource;
use App\Models\Banner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Carbon\Carbon;

class BannersController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $today = Carbon::today();

        $banners = Banner::query()
            ->where('is_active', true)
            ->where(function ($query) use ($today) {
                $query->whereNull('valid_from')->orWhere('valid_from', '<=', $today);
            })
            ->where(function ($query) use ($today) {
                $query->whereNull('valid_until')->orWhere('valid_until', '>=', $today);
            })
            ->when($request->get('position'), function ($query, $position) {
                $query->where('position', $position);
            })
            ->orderBy('sort_order')
            ->get();

        return BannerResource::collection($banners);
    }

    public function show(Banner $banner): BannerResource
    {
        return new BannerResource($banner);
    }

    public function store(BannerRequest $request): JsonResponse
    {
        $banner = Banner::create([
            'image_url' => $request->image_url,
            'link' => $request->link,
            'position' => $request->position ?? 'homepage',
            'sort_order' => $request->sort_order ?? 0,
            'is_active' => $request->is_active ?? true,
            'valid_from' => $request->valid_from,
            'valid_until' => $request->valid_until,
        ]);

        // Set translations if provided
        if ($request->has('translations')) {
            foreach ($request->translations as $locale => $translation) {
                if (isset($translation['title'])) {
                    $banner->setTranslation('title', $locale, $translation['title']);
                }
                if (isset($translation['description'])) {
                    $banner->setTranslation('description', $locale, $translation['description']);
                }
            }
            $banner->save();
        }

        return response()->json([
            'message' => 'Banner created successfully.',
            'banner' => new BannerResource($banner),
        ], 201);
    }

    public function update(BannerRequest $request, Banner $banner): JsonResponse
    {
        $banner->update([
            'image_url' => $request->image_url,
            'link' => $request->link,
            'position' => $request->position ?? $banner->position,
            'sort_order' => $request->sort_order ?? $banner->sort_order,
            'is_active' => $request->is_active ?? $banner->is_active,
            'valid_from' => $request->valid_from,
            'valid_until' => $request->valid_until,
        ]);

        // Update translations if provided
        if ($request->has('translations')) {
            foreach ($request->translations as $locale => $translation) {
                if (isset($translation['title'])) {
                    $banner->setTranslation('title', $locale, $translation['title']);
                }
                if (isset($translation['description'])) {
                    $banner->setTranslation('description', $locale, $translation['description']);
                }
            }
            $banner->save();
        }

        return response()->json([
            'message' => 'Banner updated successfully.',
            'banner' => new BannerResource($banner),
        ]);
    }

    public function destroy(Banner $banner): JsonResponse
    {
        $banner->delete();

        return response()->json([
            'message' => 'Banner deleted successfully.',
        ]);
    }
}
