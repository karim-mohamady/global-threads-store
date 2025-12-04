<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class ProductsController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $products = QueryBuilder::for(Product::class)
            ->allowedFilters([
                AllowedFilter::exact('category_id'),
                AllowedFilter::exact('is_featured'),
                AllowedFilter::exact('is_active'),
                AllowedFilter::scope('search'),
            ])
            ->allowedSorts(['price', 'created_at', 'average_rating', 'views'])
            ->with(['category', 'variants'])
            ->where('is_active', true)
            ->paginate($request->get('per_page', 15));

        return ProductResource::collection($products);
    }

    public function show(Product $product): ProductResource
    {
        $product->increment('views');
        $product->load(['category', 'variants', 'reviews' => function ($query) {
            $query->where('is_approved', true)->latest()->limit(10);
        }]);

        return new ProductResource($product);
    }

    public function store(ProductRequest $request): JsonResponse
    {
        $product = Product::create([
            'category_id' => $request->category_id,
            'sku' => $request->sku,
            'price' => $request->price,
            'cost' => $request->cost,
            'discount_price' => $request->discount_price,
            'stock_quantity' => $request->stock_quantity,
            'minimum_stock' => $request->minimum_stock ?? 5,
            'image_url' => $request->image_url,
            'images' => $request->images,
            'is_featured' => $request->is_featured ?? false,
            'is_active' => $request->is_active ?? true,
        ]);

        // Set translations
        if ($request->has('translations')) {
            foreach ($request->translations as $locale => $translation) {
                if (isset($translation['name'])) {
                    $product->setTranslation('name', $locale, $translation['name']);
                }
                if (isset($translation['description'])) {
                    $product->setTranslation('description', $locale, $translation['description']);
                }
                if (isset($translation['short_description'])) {
                    $product->setTranslation('short_description', $locale, $translation['short_description']);
                }
            }
            $product->save();
        }

        return response()->json([
            'message' => 'Product created successfully.',
            'product' => new ProductResource($product->load('category')),
        ], 201);
    }

    public function update(ProductRequest $request, Product $product): JsonResponse
    {
        $product->update([
            'category_id' => $request->category_id,
            'sku' => $request->sku,
            'price' => $request->price,
            'cost' => $request->cost,
            'discount_price' => $request->discount_price,
            'stock_quantity' => $request->stock_quantity,
            'minimum_stock' => $request->minimum_stock ?? $product->minimum_stock,
            'image_url' => $request->image_url,
            'images' => $request->images,
            'is_featured' => $request->is_featured ?? $product->is_featured,
            'is_active' => $request->is_active ?? $product->is_active,
        ]);

        // Update translations
        if ($request->has('translations')) {
            foreach ($request->translations as $locale => $translation) {
                if (isset($translation['name'])) {
                    $product->setTranslation('name', $locale, $translation['name']);
                }
                if (isset($translation['description'])) {
                    $product->setTranslation('description', $locale, $translation['description']);
                }
                if (isset($translation['short_description'])) {
                    $product->setTranslation('short_description', $locale, $translation['short_description']);
                }
            }
            $product->save();
        }

        return response()->json([
            'message' => 'Product updated successfully.',
            'product' => new ProductResource($product->load('category')),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully.',
        ]);
    }
}
