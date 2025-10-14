<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TaskCategory;
use Illuminate\Http\Request;

class TaskCategoryController extends Controller
{
    public function index()
    {
        return response()->json(TaskCategory::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:task_categories',
            'description' => 'nullable|string',
        ]);

        $category = TaskCategory::create($validated);

        return response()->json(['message' => 'Task category created', 'category' => $category], 201);
    }

    public function show($id)
    {
        $category = TaskCategory::find($id);
        if (!$category) return response()->json(['error' => 'Task category not found'], 404);
        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $category = TaskCategory::find($id);
        if (!$category) return response()->json(['error' => 'Task category not found'], 404);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:task_categories,name,' . $id,
            'description' => 'nullable|string',
        ]);

        $category->update($validated);

        return response()->json(['message' => 'Task category updated', 'category' => $category]);
    }

    public function destroy($id)
    {
        $category = TaskCategory::find($id);
        if (!$category) return response()->json(['error' => 'Task category not found'], 404);
        $category->delete();
        return response()->json(['message' => 'Task category deleted']);
    }
}
