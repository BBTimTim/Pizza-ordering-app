<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;


class GuestController extends Controller
{
    public function register(Request $request)
  {
    try {
      $validated = $request->validate([
        'name' => ['required', 'min:4', 'max:30'],
        'email' => ['required', 'email', 'unique:users'],
        'password' => ['required', 'min:4', 'max:30', 'confirmed'],
      ]);
    } catch (ValidationException $e) {
      return response(['errors' => $e->errors()], 422);
    }
    $validated['password'] = Hash::make($validated['password']);
    User::create($validated);
    return response(['success' => 'Sikeres regisztráció!']);
  }

  public function login(Request $request)
  {
    $request->validate([
      'email' => 'required|email',
      'password' => 'required',
    ]);
    $user = User::where('email', $request->email)->first();
    if (!$user || !Hash::check($request->password, $user->password)) {
      return response()->json([
        'errors' => 'Hibás email vagy jelszó!'
      ]);
    }
    $token = $user->createToken('mytoken')->plainTextToken;
    return response()->json([
      'token' => $token
    ]);
  }

   public function forgetpassword(Request $request)
  { 
    try {
      $request->validate(['email' => 'required|email']);
      $status = Password::sendResetLink($request->only('email'));
      return response()->json([
        'message' => $status === Password::RESET_LINK_SENT
          ? 'Sikeresen elküldtük a jelszó-visszaállító emailt.'
          : 'Hiba történt, nincs ilyen email cím.'
      ]);
    } catch (ValidationException $e) {
      return response(['errors' => $e->errors()], 422);
    }
  }

  public function resetpassword(Request $request)
  {
    $request->validate([
      'token' => 'required',
      'email' => 'required|email',
      'password' => 'required|min:4|confirmed',
    ]);

    $status = Password::reset(
      $request->only('email', 'password', 'password_confirmation', 'token'),
      function ($user, string $password) {
        $user->forceFill([
          'password' => Hash::make($password),
        ])->setRememberToken(Str::random(60));

        $user->save();
        event(new PasswordReset($user));
      }
    );
    return response()->json([
      'message' => $status === Password::PASSWORD_RESET
        ? 'Sikeresen módosítottad a jelszavad!.'
        : 'Hiba történt, próbáld meg újra.'
    ]);
  }
}
