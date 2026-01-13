<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Registracija
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
                                        //ora biti jedinstveno u koloni email tabele users.
            'email' => 'required|string|email|unique:users,email',
            //confirm-To znači da frontend mora poslati dva polja: password i password_confirmation
            'password' => 'required|string|confirmed',
             'phone' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'phone' => $validated['phone'] ?? null, 
             'role' => 'user',

        ]);

        //Ova linija koristi Laravel Sanctum za kreiranje novog API tokena za novokreiranog korisnika.
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
//first() izvršava query i vraća samo prvi rezultat iz baze pre toga je samo sablon za upit
// ne treba get() jer bi on vraćao kolekciju svih korisnika 
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
           return response()->json([
                'message' => 'Data is not valid'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

       
        return response()->json([
        'message' => 'Succesfully logined',
        'token' => $token,
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ]
    ]);
    }

    // Logout
    public function logout(Request $request)
    { //Briše token iz baze a na frontu iz storaga brises
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'You are succesfully logged out',
        ]);
    }
}
