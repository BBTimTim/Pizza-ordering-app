<?php

use App\Http\Controllers\admin\ProductController;
use App\Http\Controllers\admin\SizeController;
use App\Http\Controllers\admin\ToppingController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\SearchController;
use App\Services\ShopHours;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();

    return redirect(config('app.frontend_url').'/login');
})->middleware(['signed'])->name('verification.verify');

Route::get('/profile', function () {})->middleware(['auth', 'verified']);

Route::controller(GuestController::class)->middleware('throttle:10,1')->group(function () {
    Route::post('register', 'register');
    Route::post('login', 'login');
    Route::post('resetpassword', 'resetpassword');
    Route::post('forgetpassword', 'forgetpassword');
});

Route::post('checkout', [OrderController::class, 'checkout'])->middleware('throttle:10,1');
Route::post('orders/{id}/confirm-payment', [OrderController::class, 'confirmPayment'])->middleware('throttle:20,1');
Route::get('my-orders', [OrderController::class, 'myOrders'])->middleware('auth:sanctum');

Route::controller(OrderController::class)->middleware(['auth:sanctum', 'status:admin'])->group(function () {
    Route::get('orders', 'index');
    Route::get('orders/{id}', 'show');
    Route::post('orders/{id}/status', 'updateStatus');
});

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

Route::get('products', [ProductController::class, 'index']);
Route::get('featured-products', [ProductController::class, 'featured']);
Route::get('popular-products', [ProductController::class, 'popular']);
Route::get('sizes', [SizeController::class, 'index']);
Route::get('toppings', [ToppingController::class, 'index']);

Route::get('products-result', [SearchController::class, 'searchProducts']);

// Nyitvatartás: nyitva vagyunk-e most, és a heti rend
Route::get('shop-status', function (ShopHours $shopHours) {
    return response()->json([
        'open' => $shopHours->isOpen(),
        'message' => $shopHours->message(),
        'hours' => $shopHours->weekly(),
    ], 200);
});

Route::get('health', function () {
    try {
        DB::select('SELECT 1');
    } catch (Throwable) {
        return response()->json(['status' => 'hiba', 'database' => 'nem elérhető'], 503);
    }

    return response()->json(['status' => 'ok', 'database' => 'ok', 'version' => config('app.version')], 200);
});
