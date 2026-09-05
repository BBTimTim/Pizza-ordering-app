<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
class ProductController extends Controller
{
  public function index(Request $request)
{
    $user = $request->user();
    if ($user && $user->status === 'admin') {
        $products = Product::latest()->get();
    } else {
        $products = Product::where('status', 'active')
            ->latest()
            ->get();
    }
    return response()->json([
        'data' => $products
    ], 200);
}

    public function show($id) {
        $product = Product::findOrFail($id);
        return response($product);
    }
    public function store(Request $request)
    {

        $validated = $request->validate([
            'name' => ['required'],
            'price' => ['required', 'numeric', 'min:0'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg'],
            'description' => ['required', 'max:255'],
            'status' => ['required', 'in:active,block'],
            'is_featured' => ['required', 'in:yes,no'],
        ]);

        $product = Product::create($validated);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('uploads/products/'), $imageName);

            $product->image = $imageName;
            $product->save();
        }

        return response()->json([
            'success' => 'Sikeres feltöltés!',
            'data' => [
                'product' => $product
            ]
        ], 200);
    }


    public function featured() {
        $featuredProducts = Product::where(['is_featured' => 'yes', 'status' => 'active'])->latest()->get();

     return response()->json([
            'data' =>  $featuredProducts
        ], 200);
    }    
    public function update(Request $request, $id)
    {

        $validated = $request->validate([
            'name' => ['required'],
            'price' => ['required', 'numeric', 'min:0'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg'],
            'description' => ['required', 'max:255'],
            'status' => ['required', 'in:active,block'],
            'is_featured' => ['required', 'in:yes,no'],   
        ]);

        $product = Product::findOrFail($id);
        $product->update($validated);

          if ($request->hasFile('image')) {
             if ($product->image) {
                File::delete(
                    public_path('uploads/products/' . $product->image)
                );
            };

            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('uploads/products'), $imageName);

            $product->image = $imageName;
            $product->save();
           }
             return response()->json([
            'success' => 'Sikeres módosítva!',
            'data' => [
                'product' => $product
            ]
        ], 200);
    }

    public function destroy($id) {
        $product = Product::findOrFail($id);
          if ($product->image) {
                File::delete(
                    public_path('uploads/products/' . $product->image)
                );
            };
        $product->delete();
          return response()->json(['success' => 'Sikeresen törölve!'], 200);
    }
}
