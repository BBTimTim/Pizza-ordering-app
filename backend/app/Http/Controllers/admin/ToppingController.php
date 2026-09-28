<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Topping;
use Illuminate\Http\Request;

class ToppingController extends Controller
{
    public function index()
    {
        $toppings = Topping::orderBy('price', 'ASC')->get();

        return response()->json([
            'data' => $toppings,
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required'],
            'price' => ['required', 'numeric', 'min:0'],
        ]);
        Topping::create($validated);

        return response()->json(['success' => 'Sikeres mentés!'], 200);
    }

    public function destroy($id)
    {
        $topping = Topping::findOrFail($id);
        $topping->delete();

        return response()->json(['success' => 'Sikeresen törölve!'], 200);
    }
}
