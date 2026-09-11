<?php

namespace App\Http\Controllers;

use App\Models\OrderItems;
use Illuminate\Http\Request;

class OrderItemsController extends Controller
{
        
  public function index() {
    $orderItems = OrderItems::all();
         return response()->json([
        'data' => $orderItems,
    ], 200);
    }

    public function show($id) {
         $orderItem = OrderItems::findOrFail($id);
         return response()->json([
        'data' => $orderItem,
    ], 200);
    }

    public function destroy($id)
    {
        $orderItem = OrderItems::findOrFail($id);
        $orderItem->delete();
        return response()->json(['success' => 'Sikeresen törölve!'], 200);
    }
}
