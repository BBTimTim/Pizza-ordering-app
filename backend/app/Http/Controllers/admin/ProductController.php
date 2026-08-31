<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
public function index() {
    $products = Product::with(['topping', 'size'])
            ->where('status', 1)
            ->latest()
            ->get();

     return response()->json([
        'data' => $products
    ], 200);
}

public function store(Request $request) {
    $validated = $request->validate([
        'name' => ['required'],
        'price' => ['required', 'numeric', 'min:0'],
        'image' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
        'description' => ['required', 'max:255'],
        'quantity' => ['nullable', 'integer', 'min:0'],
        'status' => ['required', 'enum'],
        'is_featured' => ['required', 'enum'],
        'topping_id' => ['exists:toppings,id'],
    ]);

    $product = Product::create($validated);

     return response()->json([
            'success' => 'Sikeres feltöltés!',
            'product_id' => $product->id
        ], 200);
    }
}

