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
}
