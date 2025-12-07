<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OrdersController extends Controller
{
    public function __construct(
        protected OrderService $orderService
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $orders = Order::query()
            ->where('user_id', $request->user()->id)
            ->with(['items', 'addresses', 'coupon'])
            ->latest()
            ->paginate($request->get('per_page', 15));

        return OrderResource::collection($orders);
    }

    public function adminIndex(Request $request): AnonymousResourceCollection
    {
        $orders = Order::query()
            ->with(['user', 'items', 'addresses', 'coupon'])
            ->when($request->get('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->get('payment_status'), function ($query, $status) {
                $query->where('payment_status', $status);
            })
            ->when($request->get('search'), function ($query, $search) {
                $query->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('first_name', 'like', "%{$search}%")
                          ->orWhere('last_name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                    });
            })
            ->latest()
            ->paginate($request->get('per_page', 15));

        return OrderResource::collection($orders);
    }

    public function show(Request $request, Order $order): OrderResource|JsonResponse
    {
        if ($order->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $order->load(['items.product', 'addresses', 'coupon']);

        return new OrderResource($order);
    }

    public function store(OrderRequest $request): JsonResponse
    {
        try {
            $order = $this->orderService->create($request, $request->user());

            return response()->json([
                'message' => 'Order created successfully.',
                'order' => new OrderResource($order),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create order.',
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled,refunded',
        ]);

        $order->update([
            'status' => $validated['status'],
            'confirmed_at' => $validated['status'] === 'confirmed' ? now() : $order->confirmed_at,
            'shipped_at' => $validated['status'] === 'shipped' ? now() : $order->shipped_at,
            'delivered_at' => $validated['status'] === 'delivered' ? now() : $order->delivered_at,
        ]);

        return response()->json([
            'message' => 'Order status updated successfully.',
            'order' => new OrderResource($order->load(['items', 'addresses', 'coupon'])),
        ]);
    }
}
