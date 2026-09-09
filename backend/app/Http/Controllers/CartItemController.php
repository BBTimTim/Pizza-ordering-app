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

    public function destroy($id) {
        $cart = CartItem::findOrFail($id);
        $cart->delete();
          return response()->json(['success' => 'Sikeresen törölve!'], 200);
    }
}
