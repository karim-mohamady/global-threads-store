<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class CartService
{
    public function forUserOrSession(): Cart
    {
        if (Auth::check()) {
            return Cart::firstOrCreate(['user_id' => Auth::id()]);
        }

        $sessionId = session()->getId();
        return Cart::firstOrCreate(['session_id' => $sessionId]);
    }

    public function addItem(array $data): Cart
    {
        $cart = $this->forUserOrSession();
        $product = Product::findOrFail($data['product_id']);

        $cartItem = CartItem::where([
            ['cart_id', '=', $cart->id],
            ['product_id', '=', $product->id],
            ['product_variant_id', '=', $data['product_variant_id'] ?? null],
        ])->first();

        if ($cartItem) {
            $cartItem->update(['quantity' => $cartItem->quantity + ($data['quantity'] ?? 1)]);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'product_variant_id' => $data['product_variant_id'] ?? null,
                'quantity' => $data['quantity'] ?? 1,
                'price' => $product->getDisplayPrice(),
            ]);
        }

        return $cart->load('items');
    }

    public function removeItem(array $data): Cart
    {
        $cart = $this->forUserOrSession();
        CartItem::where('id', $data['item_id'])->where('cart_id', $cart->id)->delete();

        return $cart->load('items');
    }

    public function updateItems(array $data): Cart
    {
        $cart = $this->forUserOrSession();

        foreach ($data['items'] as $item) {
            if ($item['quantity'] > 0) {
                CartItem::where('id', $item['id'])->where('cart_id', $cart->id)
                    ->update(['quantity' => $item['quantity']]);
            } else {
                CartItem::where('id', $item['id'])->where('cart_id', $cart->id)->delete();
            }
        }

        return $cart->load('items');
    }

    public function clear(): Cart
    {
        $cart = $this->forUserOrSession();
        $cart->items()->delete();

        return $cart->load('items');
    }
}