<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function UserSearch(Request $request) {

    $query = User::query();
        if($request->search) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orwhere('email', 'like', "%{$request->search}%");
        }
        try {
        
        $users = $query->latest()->paginate(10);
          return response()->json([
            'data' => $users
        ], 200);
        } catch (Exception $e) {
               return response()->json([
            'error' => $e->getMessage(),
        ], 200);
        }
    }

 public function destroy($id) {
      $user = User::findOrFail($id);
      $user->delete() ;
          return response()->json(['success' => 'Felhasználó törölve!']);
 }
}
