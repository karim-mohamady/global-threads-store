<?php

namespace App\Providers;

use App\Services\CartService;
use App\Services\OrderService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton('cartService', CartService::class);
        $this->app->singleton('orderService', OrderService::class);
    }

    public function boot(): void
    {
        //
    }
}