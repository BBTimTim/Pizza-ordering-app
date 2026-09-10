<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
public function destroy(Request $request) {
    $request->user()->delete();
      return response()->json(['success' => 'A fiókod sikeresen törölve lett!']);
 }
}
