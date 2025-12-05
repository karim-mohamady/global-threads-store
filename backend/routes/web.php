<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'Global Threads Store API',
        'version' => '1.0.0',
        'status' => 'running',
    ]);
});
