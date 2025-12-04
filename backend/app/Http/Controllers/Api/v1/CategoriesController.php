<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CategoriesController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $categories = Category::query()
            ->when($request->get('parent_only'), function ($query) {
                $query->whereNull('parent_id');
            })
            ->when($request->get('with_children'), function ($query) {
                $query->with('children');
            })
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return CategoryResource::collection($categories);
    }

    public function show(Category $category): CategoryResource
    {
        $category->load(['children', 'products' => function ($query) {
            $query->where('is_active', true)->limit(20);
        }]);

        return new CategoryResource($category);
    }

    public function store(CategoryRequest $request): JsonResponse
    {
        $category = Category::create([
            'parent_id' => $request->parent_id,
            'slug' => $request->slug,
            'image_url' => $request->image_url,
            'sort_order' => $request->sort_order ?? 0,
            'is_active' => $request->is_active ?? true,
        ]);

        // Set translations
        if ($request->has('translations')) {
            foreach ($request->translations as $locale => $translation) {
                if (isset($translation['name'])) {
                    $category->setTranslation('name', $locale, $translation['name']);
                }
                if (isset($translation['description'])) {
                    $category->setTranslation('description', $locale, $translation['description']);
                }
            }
            $category->save();
        }

        return response()->json([
            'message' => 'Category created successfully.',
            'category' => new CategoryResource($category),
        ], 201);
    }

    public function update(CategoryRequest $request, Category $category): JsonResponse
    {
        $category->update([
            'parent_id' => $request->parent_id,
            'slug' => $request->slug,
            'image_url' => $request->image_url,
            'sort_order' => $request->sort_order ?? $category->sort_order,
            'is_active' => $request->is_active ?? $category->is_active,
        ]);

        // Update translations
        if ($request->has('translations')) {
            foreach ($request->translations as $locale => $translation) {
                if (isset($translation['name'])) {
                    $category->setTranslation('name', $locale, $translation['name']);
                }
                if (isset($translation['description'])) {
                    $category->setTranslation('description', $locale, $translation['description']);
                }
            }
            $category->save();
        }

        return response()->json([
            'message' => 'Category updated successfully.',
            'category' => new CategoryResource($category),
        ]);
    }

    public function destroy(Category $category): JsonResponse
    {
        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully.',
        ]);
    }
}
