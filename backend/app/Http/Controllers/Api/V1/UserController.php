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
    // GET /api/v1/user
    public function index()
    {
        $users = User::with('taskLists')->paginate(4);
        return UserResource::collection($users);
    }

    // POST /api/v1/user
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

    // GET /api/v1/users/{id}
    public function show($id)
    {
        $user = User::with('taskLists')->find($id);
        if (!$user) return response()->json(['error' => 'User not found'], 404);
        return new UserResource($user);
    }

    // PUT /api/v1/users/{id}
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['error' => 'User not found'], 404);

        $validated = $request->validate([
            //sometimes kaže Laravelu: "Proveri ovo polje samo ako se ono zapravo nalazi u zahtevu".
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:6',
            'role' => 'in:admin,user,guest',
        ]);

        $user->update($validated);

        return new UserResource($user);
    }

    // DELETE /api/v1/users/{id}
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['error' => 'User not found'], 404);

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

     //==============================================================================================
    //ZA POJEDINACNOG USERA
 //==================================================================================================
 public function showMe()
{
    //omogućava brz pristup objektu korisnika koji trenutno šalje zahtev.
        $user = Auth::user(); 
    return new UserResource($user);
}


public function updateMe(Request $request)
{
       /** @var \App\Models\User $user */
      $user = Auth::user();


    $validated = $request->validate([
        'name' => 'sometimes|string|max:255',
        //“proveri da li je email jedinstven među svim korisnicima osim korisnika sa ID 5 npr”.
        'email' => 'sometimes|email|unique:users,email,' . $user->id,
        'phone' => 'nullable|string|max:20',
        'password' => 'nullable|string|min:6',
        // ne sme user sam sebi rolu da menja
        //  'role' => 'in:admin,user,guest',
    ]);

    $user->update($validated);

    return new UserResource($user);
}


}
