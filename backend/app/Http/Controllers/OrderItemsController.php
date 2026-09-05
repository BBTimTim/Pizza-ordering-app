<?php

namespace App\Http\Controllers;

use App\Models\OrderItems;
use Illuminate\Http\Request;

class OrderItemsController extends Controller
{ 
    
public function index() {
    $sizes = OrderItems::orderBy('size', 'ASC')->get();
    return response()->json([
        'data' => $sizes,
    ], 200);
}

   public function store(Request $request){
         $validated = $request->validate([
             'name' => ['required'],
             'quantity' => ['required', 'numeric', 'min:1'],
             'order_id' => ['exists:orders,id'],
             'total' => [ 'required','numeric'],
         ]);
          OrderItems::create($validated);
          return response()->json(['success' => 'Sikeres mentés!'], 200);
    }
    
   public function destroy($id) {
        $size = OrderItems::findOrFail($id);
        $size->delete();
          return response()->json(['success' => 'Sikeresen törölve!'], 200);
    }
}