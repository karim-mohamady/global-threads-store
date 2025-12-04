<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReviewsController extends Controller
{
    public function index(Request $request, Product $product): AnonymousResourceCollection
    {
        $reviews = Review::query()
            ->where('product_id', $product->id)
            ->where('is_approved', true)
            ->with('user')
            ->latest()
            ->paginate($request->get('per_page', 10));

        return ReviewResource::collection($reviews);
    }

    public function store(ReviewRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Check if user already reviewed this product
        $existing = Review::where('user_id', $request->user()->id)
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You have already reviewed this product.',
            ], 422);
        }

        // Check if user has purchased the product
        $isVerifiedPurchase = $request->user()->orders()
            ->whereHas('items', function ($query) use ($validated) {
                $query->where('product_id', $validated['product_id']);
            })
            ->where('status', 'delivered')
            ->exists();

        $review = Review::create([
            'user_id' => $request->user()->id,
            'product_id' => $validated['product_id'],
            'rating' => $validated['rating'],
            'title' => $validated['title'] ?? null,
            'comment' => $validated['comment'] ?? null,
            'is_verified_purchase' => $isVerifiedPurchase,
            'is_approved' => false, // Requires admin approval
        ]);

        // Update product average rating
        $this->updateProductRating($validated['product_id']);

        return response()->json([
            'message' => 'Review submitted successfully. It will be visible after approval.',
            'review' => new ReviewResource($review),
        ], 201);
    }

    public function update(ReviewRequest $request, Review $review): JsonResponse
    {
        if ($review->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validated();

        $review->update([
            'rating' => $validated['rating'],
            'title' => $validated['title'] ?? $review->title,
            'comment' => $validated['comment'] ?? $review->comment,
            'is_approved' => false, // Re-require approval after edit
        ]);

        $this->updateProductRating($review->product_id);

        return response()->json([
            'message' => 'Review updated successfully.',
            'review' => new ReviewResource($review),
        ]);
    }

    public function destroy(Request $request, Review $review): JsonResponse
    {
        if ($review->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $productId = $review->product_id;
        $review->delete();

        $this->updateProductRating($productId);

        return response()->json([
            'message' => 'Review deleted successfully.',
        ]);
    }

    protected function updateProductRating(int $productId): void
    {
        $product = Product::find($productId);
        if ($product) {
            $avgRating = Review::where('product_id', $productId)
                ->where('is_approved', true)
                ->avg('rating');
            $product->update(['average_rating' => $avgRating ?? 0]);
        }
    }
}
