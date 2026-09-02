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

Route::resource('products', ProductController::class);

Route::get('toppings', [ToppingController::class, 'index']);
Route::get('sizes', [SizeController::class, 'index']);

Route::post('register', [GuestController::class, 'register']);
Route::post('login', [GuestController::class, 'login']);
Route::post('resetpassword', [GuestController::class, 'resetpassword']);
Route::post('forgetpassword', [GuestController::class, 'forgetpassword']);
