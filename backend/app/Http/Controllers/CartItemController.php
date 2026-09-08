<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use Illuminate\Http\Request;

class CartItemController extends Controller
{
    public function index() {
    $cartitems = CartItem::all();
         return response()->json([
        'data' => $cartitems,
    ], 200);
    }

    public function store(Request $request){
         $validated = $request->validate([
             'price' => ['required', 'numeric'],
             'quantity' => ['required', 'integer', 'min:1'],
             'order_id' => ['exists:orders,id'],
             'product_id' => ['exists:products,id'],
         ]);
          CartItem::create($validated);
          return response()->json(['success' => 'Sikeres rendelés!'], 200);
    }

    public function destroy($id) {
        $cart = CartItem::findOrFail($id);
        $cart->delete();
          return response()->json(['success' => 'Sikeresen törölve!'], 200);
    }
}
