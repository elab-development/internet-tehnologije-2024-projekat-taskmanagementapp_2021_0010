<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\V1\UserResource;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('taskLists')->paginate(4);
        return UserResource::collection($users);
    }

    public function store(Request $request)
    {
       $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:6',
            'role' => 'in:admin,user,guest',
        ]);

        $user = User::create($validated);

        return new UserResource($user);
    }

    public function show($id)
    {
        $user = User::with('taskLists')->find($id);
        if (!$user) return response()->json(['error' => 'User not found'], 404);
        return new UserResource($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['error' => 'User not found'], 404);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:6',
            'role' => 'in:admin,user,guest',
        ]);

        $user->update($validated);

        return new UserResource($user);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['error' => 'User not found'], 404);

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

   public function showMe()
{
        $user = Auth::user(); 
    return new UserResource($user);
}


public function updateMe(Request $request)
{
       /** @var \App\Models\User $user */
      $user = Auth::user();


    $validated = $request->validate([
        'name' => 'sometimes|string|max:255',
        'email' => 'sometimes|email|unique:users,email,' . $user->id,
        'phone' => 'nullable|string|max:20',
        'password' => 'nullable|string|min:6',
    ]);

    $user->update($validated);

    return response()->json([
        'message' => 'Profile updated successfully!',
        'user' => new UserResource($user)
    ], 200);
}


}
