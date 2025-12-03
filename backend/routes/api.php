<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\ProductsController;
use App\Http\Controllers\Api\v1\CategoriesController;
use App\Http\Controllers\Api\v1\CartController;
use App\Http\Controllers\Api\v1\WishlistController;
use App\Http\Controllers\Api\v1\OrdersController;
use App\Http\Controllers\Api\v1\ReviewsController;
use App\Http\Controllers\Api\v1\CouponsController;
use App\Http\Controllers\Api\v1\BannersController;
use App\Http\Controllers\Api\v1\AdminController;

Route::prefix('v1')->group(function () {

    // Public auth routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Public product routes
    Route::apiResource('products', ProductsController::class)->only(['index', 'show']);
    Route::apiResource('categories', CategoriesController::class)->only(['index', 'show']);
    Route::apiResource('banners', BannersController::class)->only(['index', 'show']);

    // Public reviews
    Route::get('/products/{product}/reviews', [ReviewsController::class, 'index']);

    // Public coupons
    Route::get('/coupons', [CouponsController::class, 'index']);
    Route::get('/coupons/{coupon}', [CouponsController::class, 'show']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {

        // Auth
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
        Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

        // Cart
        Route::get('/cart', [CartController::class, 'show']);
        Route::put('/cart', [CartController::class, 'update']);
        Route::post('/cart/items', [CartController::class, 'addItem']);
        Route::delete('/cart/items/{id}', [CartController::class, 'removeItem']);
        Route::post('/cart/clear', [CartController::class, 'clear']);

        // Wishlist
        Route::apiResource('wishlists', WishlistController::class)->only(['index', 'store', 'destroy']);

        // Orders
        Route::apiResource('orders', OrdersController::class)->only(['index', 'show', 'store']);

        // Reviews
        Route::post('/reviews', [ReviewsController::class, 'store']);
        Route::put('/reviews/{review}', [ReviewsController::class, 'update']);
        Route::delete('/reviews/{review}', [ReviewsController::class, 'destroy']);

        // Admin routes
        Route::middleware('is. admin')->group(function () {
            Route::apiResource('products', ProductsController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('categories', CategoriesController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('coupons', CouponsController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('banners', BannersController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('admin/users', AdminController::class);
        });
    });
});