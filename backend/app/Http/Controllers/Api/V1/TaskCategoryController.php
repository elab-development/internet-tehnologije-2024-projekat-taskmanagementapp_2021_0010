<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TaskCategory;
use Illuminate\Http\Request;
use App\Http\Resources\V1\TaskCategoryResource;
use Illuminate\Support\Facades\Auth;

class TaskCategoryController extends Controller
{
    public function index()
    {
    $categories = TaskCategory::paginate(5);
    return TaskCategoryResource::collection($categories);
    }


   public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:task_categories,name',
            'description' => 'nullable|string',
        ]);

        $category = TaskCategory::create($validated);
        return new TaskCategoryResource($category);
    }

    public function show($id)
    {  
        $category = TaskCategory::find($id);
        if (!$category) return response()->json(['error' => 'Category not found'], 404);
        return new TaskCategoryResource($category);
    }

    public function update(Request $request, $id)
    {
        $category = TaskCategory::find($id);
        if (!$category) return response()->json(['error' => 'Category not found'], 404);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:task_categories,name,' . $id,
            'description' => 'nullable|string',
        ]);

        $category->update($validated);
        return new TaskCategoryResource($category);
    }

    public function destroy($id)
    {
        $category = TaskCategory::find($id);
        if (!$category) return response()->json(['error' => 'Category not found'], 404);

        $category->delete();
        return response()->json(['message' => 'Category deleted']);
    }
}
