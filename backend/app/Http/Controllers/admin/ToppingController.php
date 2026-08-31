<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Topping;
use Illuminate\Http\Request;

class ToppingController extends Controller
{
public function index() {
 $toppings = Topping::orderBy('price', 'ASC')->get();
    return response()->json([
        'data' => $toppings,
    ], 200);
}
}
