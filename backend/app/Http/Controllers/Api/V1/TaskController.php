<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use App\Http\Resources\V1\TaskResource;
class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::with(['category', 'taskList'])->paginate(5);
        return TaskResource::collection($tasks);
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
        return new TaskResource($task);
    }

    public function show($id)
    {
         $task = Task::with(['category', 'taskList'])->find($id);
        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }
        return new TaskResource($task);
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
        return new TaskResource($task);
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
        $tasks = Task::where('priority', $priority)->paginate(5);
        return TaskResource::collection($tasks);
    }

    public function filterByCategory($id)
{
    $tasks = Task::where('category_id', $id)->paginate(5);
    return TaskResource::collection($tasks);
}

public function getByTaskList($id)
{
    $tasks = Task::where('task_list_id', $id)->with(['category'])->paginate(5);
    return TaskResource::collection($tasks);
}

public function dueSoon()
{
    $today = now();
    $tasks = Task::where('deadline', '>=', $today)
                 ->where('deadline', '<=', $today->copy()->addDays(7))
                 ->paginate(5);
    return TaskResource::collection($tasks);
}


    public function search(Request $request)
{
   $query = $request->query('query');

    if (!$query) {
        return TaskResource::collection(Task::paginate(5));
    }

    // Pretvori sve u mala slova za poređenje
    $queryLower = strtolower($query);

    $tasks = Task::whereRaw('LOWER(title) LIKE ?', ["%{$queryLower}%"])
        ->orWhereRaw('LOWER(description) LIKE ?', ["%{$queryLower}%"])
        ->paginate(5);

    if ($tasks->isEmpty()) {
        return response()->json([
            'message' => 'Nema zadataka koji odgovaraju pretrazi.',
            'query' => $query,
            'data' => []
        ]);
    }

    return TaskResource::collection($tasks);

}
}
