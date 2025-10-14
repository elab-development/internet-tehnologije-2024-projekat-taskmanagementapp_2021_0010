<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TaskList;
use Illuminate\Http\Request;

class TaskListController extends Controller
{
    public function index()
    {
        return response()->json(TaskList::with('tasks')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_favorite' => 'boolean'
        ]);

        $list = TaskList::create($validated);

        return response()->json(['message' => 'Task list created', 'list' => $list], 201);
    }

    public function show($id)
    {
        $list = TaskList::with('tasks')->find($id);
        if (!$list) return response()->json(['error' => 'Task list not found'], 404);
        return response()->json($list);
    }

    public function update(Request $request, $id)
    {
        $list = TaskList::find($id);
        if (!$list) return response()->json(['error' => 'Task list not found'], 404);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'is_favorite' => 'boolean'
        ]);

        $list->update($validated);
        return response()->json(['message' => 'Task list updated', 'list' => $list]);
    }

    public function destroy($id)
    {
        $list = TaskList::find($id);
        if (!$list) return response()->json(['error' => 'Task list not found'], 404);
        $list->delete();
        return response()->json(['message' => 'Task list deleted']);
    }
}
