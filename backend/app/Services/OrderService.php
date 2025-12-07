<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Support\Str;

class OrderService
{
    public function create($request, User $user): Order
    {
        $cart = Cart::where('user_id', $user->id)->firstOrFail();

        if ($cart->isEmpty()) {
            throw new \Exception('Cart is empty');
        }

        $subtotal = $cart->getSubtotal();
        $taxAmount = $subtotal * 0.10; // 10% tax
        $shippingCost = 50; // Fixed shipping
        $discountAmount = 0;

        // Apply coupon
        $coupon = null;
        if ($request->coupon_code) {
            $coupon = Coupon::where('code', $request->coupon_code)->firstOrFail();

            if (!$coupon->canBeUsedByUser($user)) {
                throw new \Exception('Coupon cannot be used');
            }

            $discountAmount = $coupon->calculateDiscount($subtotal);
        }

        $totalAmount = $subtotal + $taxAmount + $shippingCost - $discountAmount;

        // Create order
        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'ORD-' . Str::random(12),
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'shipping_cost' => $shippingCost,
            'discount_amount' => $discountAmount,
            'total_amount' => $totalAmount,
            'coupon_id' => $coupon?->id,
            'payment_method' => $request->payment_method,
            'status' => 'pending',
            'payment_status' => 'pending',
        ]);

        // Add order items
        foreach ($cart->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'product_variant_id' => $item->product_variant_id,
                'product_name' => $item->product->getTranslation('name', 'en'),
                'quantity' => $item->quantity,
                'price' => $item->price,
                'total' => $item->getTotal(),
            ]);
        }

        // Add addresses
        OrderAddress::create([
            'order_id' => $order->id,
            'type' => 'shipping',
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'street_address' => $request->shipping_address['street_address'],
            'city' => $request->shipping_address['city'],
            'state' => $request->shipping_address['state'] ?? null,
            'postal_code' => $request->shipping_address['postal_code'],
            'country' => $request->shipping_address['country'],
            'phone' => $request->shipping_address['phone'],
        ]);

        OrderAddress::create([
            'order_id' => $order->id,
            'type' => 'billing',
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'street_address' => $request->billing_address['street_address'],
            'city' => $request->billing_address['city'],
            'state' => $request->billing_address['state'] ?? null,
            'postal_code' => $request->billing_address['postal_code'],
            'country' => $request->billing_address['country'],
            'phone' => $request->billing_address['phone'],
        ]);

        // Record coupon usage
        if ($coupon) {
            CouponUsage::create([
                'coupon_id' => $coupon->id,
                'user_id' => $user->id,
                'order_id' => $order->id,
            ]);
            $coupon->increment('usage_count');
        }

        // Clear cart
        $cart->items()->delete();

        return $order->load('items', 'addresses', 'coupon');
    }
}
