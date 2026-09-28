<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Exception;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function searchProducts(Request $request)
    {

        $query = Product::query();

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%")
                ->orwhere('description', 'like', "%{$request->search}%");
        }
        try {

            $products = $query->latest()->paginate(8);

            return response()->json([
                'data' => $products,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 200);
        }
    }
}
