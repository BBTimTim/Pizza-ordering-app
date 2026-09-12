<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{

    public function index() {
    $orders = Order::all();
         return response()->json([
        'data' => $orders,
    ], 200);
    }

    public function show($id) {
         $order = Order::findOrFail($id);
         return response()->json([
        'data' => $order,
    ], 200);
    }
    public function store(Request $request) {
        
        $validated = $request->validate([
            'user_id' => ['nullable', 'numeric'],   
            'name' => ['required'],
            'email' => ['required', 'email'],
            'grand_total' => ['required', 'numeric', 'min:0'],
            'sub_total' => ['required', 'numeric', 'min:0'],
            'delivery_charges' => ['required', 'numeric', 'min:0'],
            'status' => ['required'],
            'payment_method' => ['required'],
            'payment_status' => ['required'],
            'county' => ['min:3', 'max:50'],
            'city' => ['required', 'min:3', 'max:50'],
            'zip' => ['required', 'min:4', 'max:6'],
            'address' => ['required', 'min:3', 'max:50'],
            'phone' => ['required'],
        ]);

        $order = Order::create($validated);

        foreach ($request->items as $item) {
            $order->items()->create([
                'name' => $item['name'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'product_id' => $item['id'],
            ]);
        }
        $order->load('items'); 

        return response()->json([
                'success' => 'Sikeres feltöltés!',
                'data' => $order
            ], 200);
    }

    public function update(Request $request, $id) {

    $validated = $request->validate([
        'user_id' => ['nullable', 'numeric'],   
        'name' => ['required'],
        'email' => ['required', 'email'],
        'grand_total' => ['required', 'numeric', 'min:0'],
        'sub_total' => ['required', 'numeric', 'min:0'],
        'delivery_charges' => ['required', 'numeric', 'min:0'],
        'status' => ['required'],
        'payment_method' => ['required'],
        'payment_status' => ['required'],
        'county' => ['min:3', 'max:50'],
        'city' => ['required', 'min:3', 'max:50'],
        'zip' => ['required', 'min:4', 'max:6'],
        'address' => ['required', 'min:3', 'max:50'],
        'phone' => ['required'],
    ]);

   $order = Order::findOrFail($id);
   $order->update($validated);

 return response()->json([
            'success' => 'Sikeres módosítás!',
            'data' => $order
        ], 200);
    }
}