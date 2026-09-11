<?php

use App\Http\Controllers\admin\ProductController;
use App\Http\Controllers\admin\SizeController;
use App\Http\Controllers\admin\ToppingController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderItemsController;
use App\Http\Controllers\SearchController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
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

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return redirect('http://localhost:5173/login');
})->middleware(['signed'])->name('verification.verify');

Route::get('/profile', function () {
})->middleware(['auth', 'verified']);

Route::post('register', [GuestController::class, 'register']);
Route::post('login', [GuestController::class, 'login']);
Route::post('resetpassword', [GuestController::class, 'resetpassword']);
Route::post('forgetpassword', [GuestController::class, 'forgetpassword']);

Route::post('addorder', [OrderController::class, 'store']);

Route::controller(ProductController::class)->middleware(['auth:sanctum', 'status:admin'])->group(function () {
        Route::post('addproducts', 'store');
        Route::get('products', 'index');
        Route::get('products/{id}', 'show');
        Route::post('editproduct/{id}', 'update');
        Route::delete('products/{id}', 'destroy');
    });

Route::controller(SizeController::class)->middleware(['auth:sanctum', 'status:admin'])->group(function () {
        Route::post('addsizes', 'store');
        Route::get('sizes', 'index');
        Route::delete('sizes/{id}', 'destroy');
    });

Route::controller(ToppingController::class)->middleware(['auth:sanctum', 'status:admin'])->group(function () {
        Route::post('addtoppings', 'store');
        Route::get('toppings', 'index');
        Route::delete('toppings/{id}', 'destroy');
    });

Route::controller(OrderController::class)->middleware(['auth:sanctum', 'status:admin'])->group(function () {
        Route::get('orders', 'index');
        Route::get('orders/{id}', 'show');
        Route::post('orders/{id}', 'update');
        Route::delete('orders/{id}', 'destroy');
    });

Route::get('products', [ProductController::class, 'index']);
Route::get('orderitems', [OrderItemsController::class, 'index']);
Route::get('featured-products', [ProductController::class, 'featured']);
Route::get('popular-products', [ProductController::class, 'popular']);
Route::get('sizes', [SizeController::class, 'index']);
Route::get('toppings', [ToppingController::class, 'index']);

Route::get('products-result', [SearchController::class, 'searchProducts']);

Route::controller(OrderController::class)->middleware(['auth:sanctum', 'status:user'])->group(function () {
        Route::get('orders', 'index');
        Route::get('cart', 'index');
    });