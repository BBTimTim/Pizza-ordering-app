<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Size;
use Illuminate\Http\Request;

class SizeController extends Controller
{
public function index() {
    $sizes = Size::orderBy('size', 'ASC')->get();
    return response()->json([
        'data' => $sizes,
    ], 200);
}
   public function destroy($id) {
        $size = Size::findOrFail($id);
        $size->delete();
          return response()->json(['success' => 'Sikeresen törölve!'], 200);
    }
}
