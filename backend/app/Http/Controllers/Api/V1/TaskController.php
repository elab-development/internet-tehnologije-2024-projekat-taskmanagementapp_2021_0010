<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use App\Http\Resources\V1\TaskResource;
use Illuminate\Support\Facades\Response;

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
            'task_list_id' => 'nullable|exists:task_lists,id',
            'category_id' => 'nullable|exists:task_categories,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'nullable|in:nizak,srednji,visok,hitno',
            'status' => 'nullable|in:započet,u toku,završen',
            'deadline' => 'nullable|date',
            'estimated_hours' => 'nullable|integer|min:1',
        ]);

        $task = Task::create($validated);
        return new TaskResource($task->load(['category', 'taskList']));
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
    if (!$task) {
        return response()->json(['error' => 'Task not found'], 404);
    }

    $validated = $request->validate([
        'title' => 'sometimes|string|max:255',
        'description' => 'nullable|string',
        'priority' => 'nullable|in:nizak,srednji,visok,hitno',
        'status' => 'nullable|in:započet,u toku,završen',
        'deadline' => 'nullable|date',
        'estimated_hours' => 'nullable|integer|min:1',
        'category_id' => 'nullable|exists:task_categories,id',
        'task_list_id' => 'nullable|exists:task_lists,id',
    ]);

    $task->update($validated);

    // Vrati osvežen task sa vezama (da frontend vidi promene)
    $task->load(['category', 'taskList']);

    return new TaskResource($task);
}


    public function destroy($id)
    {
        $task = Task::find($id);
        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }

        $task->delete();
        return response()->json(['message' => 'Task deleted']);
    }

    // Dodatne pomoćne metode
    public function getByTaskList($id)
    {
        $tasks = Task::where('task_list_id', $id)->with(['category'])->paginate(5);
        return TaskResource::collection($tasks);
    }

    public function filterByCategory($id)
    {
        $tasks = Task::where('category_id', $id)->paginate(5);
        return TaskResource::collection($tasks);
    }

    public function export()
    {
        $tasks = Task::with(['category', 'taskList'])->get();

        $csv = "ID,Title,Status,Priority,Deadline,Category,TaskList\n";
        foreach ($tasks as $task) {
            $category = $task->category ? $task->category->name : 'N/A';
            $taskList = $task->taskList ? $task->taskList->name : 'N/A';
            $csv .= "{$task->id},\"{$task->title}\",{$task->status},{$task->priority},{$task->deadline},{$category},{$taskList}\n";
        }

        return Response::make($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="tasks_export.csv"',
        ]);
    }
}
