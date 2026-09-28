<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Size;
use Illuminate\Http\Request;

class SizeController extends Controller
{
    public function index()
    {
        $sizes = Size::orderBy('name', 'ASC')->get();

        return response()->json([
            'data' => $sizes,
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'numeric'],
            'price_multiplier' => ['required', 'numeric', 'min:0'],
        ]);
        Size::create($validated);

        return response()->json(['success' => 'Sikeres mentés!'], 200);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => ['required', 'numeric'],
            'price_multiplier' => ['required', 'numeric', 'min:0'],
        ]);
        $size = Size::findOrFail($id);
        $size->update($validated);

        return response()->json([
            'success' => 'Sikeres módosítva!',
            'data' => $size,
        ], 200);
    }

    public function destroy($id)
    {
        $size = Size::findOrFail($id);
        $size->delete();

        return response()->json(['success' => 'Sikeresen törölve!'], 200);
    }
}
