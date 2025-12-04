<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CouponRequest;
use App\Http\Resources\CouponResource;
use App\Models\Coupon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CouponsController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $coupons = Coupon::query()
            ->valid()
            ->get();

        return CouponResource::collection($coupons);
    }

    public function show(Coupon $coupon): CouponResource|JsonResponse
    {
        if (!$coupon->isValid()) {
            return response()->json([
                'message' => 'This coupon is not valid.',
            ], 422);
        }

        return new CouponResource($coupon);
    }

    public function store(CouponRequest $request): JsonResponse
    {
        $coupon = Coupon::create($request->validated());

        return response()->json([
            'message' => 'Coupon created successfully.',
            'coupon' => new CouponResource($coupon),
        ], 201);
    }

    public function update(CouponRequest $request, Coupon $coupon): JsonResponse
    {
        $coupon->update($request->validated());

        return response()->json([
            'message' => 'Coupon updated successfully.',
            'coupon' => new CouponResource($coupon),
        ]);
    }

    public function destroy(Coupon $coupon): JsonResponse
    {
        $coupon->delete();

        return response()->json([
            'message' => 'Coupon deleted successfully.',
        ]);
    }
}
