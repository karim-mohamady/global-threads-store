<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CartRequest;
use App\Http\Resources\CartResource;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct(
        protected CartService $cartService
    ) {}

    public function show(Request $request): JsonResponse
    {
        $cart = $this->cartService->forUserOrSession();
        $cart->load(['items.product', 'items.variant']);

        return response()->json([
            'cart' => new CartResource($cart),
        ]);
    }

    public function addItem(CartRequest $request): JsonResponse
    {
        $cart = $this->cartService->addItem($request->validated());
        $cart->load(['items.product', 'items.variant']);

        return response()->json([
            'message' => 'Item added to cart.',
            'cart' => new CartResource($cart),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:cart_items,id',
            'items.*.quantity' => 'required|integer|min:0',
        ]);

        $cart = $this->cartService->updateItems($validated);
        $cart->load(['items.product', 'items.variant']);

        return response()->json([
            'message' => 'Cart updated.',
            'cart' => new CartResource($cart),
        ]);
    }

    public function removeItem(int $id): JsonResponse
    {
        $cart = $this->cartService->removeItem(['item_id' => $id]);
        $cart->load(['items.product', 'items.variant']);

        return response()->json([
            'message' => 'Item removed from cart.',
            'cart' => new CartResource($cart),
        ]);
    }

    public function clear(): JsonResponse
    {
        $cart = $this->cartService->clear();

        return response()->json([
            'message' => 'Cart cleared.',
            'cart' => new CartResource($cart),
        ]);
    }
}
