<?php

namespace App\Http\Controllers;

use App\Models\OrderItems;
use Illuminate\Http\Request;

class OrderItemsController extends Controller
{ 
    
public function index() {
    $orderItems = OrderItems::orderBy('size', 'ASC')->get();
    return response()->json([
        'data' => $orderItems,
    ], 200);
}

   public function store(Request $request){
         $validated = $request->validate([
             'name' => ['required'],
             'quantity' => ['required', 'integer', 'min:1'],
             'order_id' => ['exists:orders,id'],
             'total' => [ 'required','numeric'],
         ]);
          OrderItems::create($validated);
          return response()->json(['success' => 'Sikeres mentés!'], 200);
    }
    
   public function destroy($id) {
        $orderItems = OrderItems::findOrFail($id);
        $orderItems->delete();
          return response()->json(['success' => 'Sikeresen törölve!'], 200);
    }
}