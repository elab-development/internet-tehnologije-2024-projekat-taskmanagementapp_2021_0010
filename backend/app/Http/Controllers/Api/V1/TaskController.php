<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index()
    {
        return response()->json(Task::with(['category', 'taskList'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_list_id' => 'required|exists:task_lists,id',
            'category_id' => 'nullable|exists:task_categories,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'in:nizak,srednji,visok',
            'status' => 'in:započet,u toku,završen',
            'deadline' => 'nullable|date',
            'estimated_hours' => 'nullable|integer|min:1'
        ]);

        $task = Task::create($validated);
        return response()->json(['message' => 'Task created', 'task' => $task], 201);
    }

    public function show($id)
    {
        $task = Task::with(['category', 'taskList'])->find($id);
        if (!$task) return response()->json(['error' => 'Task not found'], 404);
        return response()->json($task);
    }

    public function update(Request $request, $id)
    {
        $task = Task::find($id);
        if (!$task) return response()->json(['error' => 'Task not found'], 404);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'in:nizak,srednji,visok',
            'status' => 'in:započet,u toku,završen',
            'deadline' => 'nullable|date',
            'estimated_hours' => 'nullable|integer|min:1'
        ]);

        $task->update($validated);
        return response()->json(['message' => 'Task updated', 'task' => $task]);
    }

    public function destroy($id)
    {
        $task = Task::find($id);
        if (!$task) return response()->json(['error' => 'Task not found'], 404);
        $task->delete();
        return response()->json(['message' => 'Task deleted']);
    }

    // ➕ dodatne API rute (tačka 8)
    public function filterByStatus($status)
    {
        $tasks = Task::where('status', $status)->get();
        return response()->json($tasks);
    }

    public function filterByPriority($priority)
    {
        $tasks = Task::where('priority', $priority)->get();
        return response()->json($tasks);
    }

    public function search(Request $request)
    {
        $query = $request->input('q');
        $tasks = Task::where('title', 'LIKE', "%$query%")->get();
        return response()->json($tasks);
    }
}
