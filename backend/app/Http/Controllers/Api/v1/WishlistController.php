<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\WishlistResource;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class WishlistController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $wishlists = Wishlist::query()
            ->where('user_id', $request->user()->id)
            ->with('product')
            ->latest()
            ->paginate($request->get('per_page', 15));

        return WishlistResource::collection($wishlists);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $existing = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Product already in wishlist.',
                'wishlist' => new WishlistResource($existing->load('product')),
            ]);
        }

        $wishlist = Wishlist::create([
            'user_id' => $request->user()->id,
            'product_id' => $validated['product_id'],
        ]);

        return response()->json([
            'message' => 'Added to wishlist.',
            'wishlist' => new WishlistResource($wishlist->load('product')),
        ], 201);
    }

    public function destroy(Request $request, Wishlist $wishlist): JsonResponse
    {
        if ($wishlist->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $wishlist->delete();

        return response()->json([
            'message' => 'Removed from wishlist.',
        ]);
    }
}
