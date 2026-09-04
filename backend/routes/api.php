<?php

use App\Http\Controllers\admin\ProductController;
use App\Http\Controllers\admin\SizeController;
use App\Http\Controllers\admin\ToppingController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('register', [GuestController::class, 'register']);
Route::post('login', [GuestController::class, 'login']);
Route::post('resetpassword', [GuestController::class, 'resetpassword']);
Route::post('forgetpassword', [GuestController::class, 'forgetpassword']);

Route::controller(ProductController::class)->middleware(['auth:sanctum', 'status:admin'])->group(function () {
        Route::post('addproducts', 'store');
        Route::get('products', 'index');
        Route::get('products/{id}', 'show');
        Route::patch('products/{id}', 'update');
        Route::delete('products/{id}', 'destroy');
    });

Route::controller(SizeController::class)->middleware(['auth:sanctum', 'status:admin'])->group(function () {
        Route::post('sizes', 'store');
        Route::get('sizes', 'index');
        Route::delete('sizes/{id}', 'destroy');
    });

Route::controller(ToppingController::class)->middleware(['auth:sanctum', 'status:admin'])->group(function () {
        Route::post('toppings', 'store');
        Route::get('toppings', 'index');
        Route::delete('toppings/{id}', 'destroy');
    });

Route::get('products', [ProductController::class, 'index']);
Route::get('featured-products', [ProductController::class, 'featured']);
Route::get('sizes', [SizeController::class, 'index']);
Route::get('toppings', [ToppingController::class, 'index']);