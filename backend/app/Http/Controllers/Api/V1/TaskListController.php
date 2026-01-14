<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TaskList;
use Illuminate\Http\Request;
use App\Http\Resources\V1\TaskListResource;
use Illuminate\Support\Facades\Auth;

class TaskListController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $lists = TaskList::with(['user', 'tasks'])
            ->where('user_id', $user->id)
            ->paginate(3);

        return TaskListResource::collection($lists);
      
    }

 public function store(Request $request)
    {
        $user = Auth::user();
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_favorite' => 'boolean'
        ]);

        $validated['user_id'] = $user->id; 
        $list = TaskList::create($validated);

        return new TaskListResource($list);
        
    }

    public function show($id)
    {
        $user = Auth::user();
        $list = TaskList::with(['user', 'tasks'])
            ->where('user_id', $user->id)
            ->find($id);

        if (!$list) {
            return response()->json(['error' => 'Task list not found'], 404);
        }

        return new TaskListResource($list);
    
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $list = TaskList::where('user_id', $user->id)->find($id);

        if (!$list) {
            return response()->json(['error' => 'Task list not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'is_favorite' => 'boolean'
        ]);

        $list->update($validated);
        return new TaskListResource($list);
      
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $list = TaskList::where('user_id', $user->id)->find($id);
        if (!$list) {
            return response()->json(['error' => 'Task list not found'], 404);
        }
        $list->delete();

        return response()->json(['message' => 'Task list deleted']);
 
    }



}