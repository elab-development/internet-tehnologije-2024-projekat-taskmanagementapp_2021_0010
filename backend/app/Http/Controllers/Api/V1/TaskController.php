<?php

namespace App\Http\Controllers\Api\V1;
use App\Http\Controllers\Api\V1\TaskListController;
use App\Models\TaskList;
use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use App\Http\Resources\V1\TaskResource;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Auth;


class TaskController extends Controller
{

     private function findTaskForUser($taskId)
    {                           
         return Task::whereHas('taskList', function ($q) {
            $q->where('user_id', Auth::id());
        })
        ->where('id', $taskId)
        ->first();
    }



    public function index()
    {
      $user = Auth::user();

      $tasks = Task::with(['category', 'taskList'])
        ->whereHas('taskList', fn($q) => $q->where('user_id', $user->id))
        ->paginate(5);

      return TaskResource::collection($tasks);
    }

    public function store(Request $request)
    {
         $validated = $request->validate([
            'task_list_id' => 'required|exists:task_lists,id',
            'category_id' => 'nullable|exists:task_categories,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'nullable|in:low,medium,high,emergency',
            'status' => 'nullable|in:started,in progress,finished',
            'deadline' => 'nullable|date',
            'estimated_hours' => 'nullable|integer|min:1'
        ]);

        $taskList = TaskList::where('id', $validated['task_list_id'])
            ->where('user_id', Auth::id())
            ->first();

        if (!$taskList) {
            return response()->json(['error' => 'Forbidden: List does not belong to user'], 403);
        }

        $task = Task::create($validated);
        return new TaskResource($task);
    }

    public function show($id)
    {
         $task = $this->findTaskForUser($id);

        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }

        return new TaskResource($task);
    }

    public function update(Request $request, $id)
    {
        $task = $this->findTaskForUser($id);

        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'nullable|in:low,medium,high,emergency',
            'status' => 'nullable|in:started,in progress,finished',
            'deadline' => 'nullable|date',
            'estimated_hours' => 'nullable|integer|min:1'
        ]);

        $task->update($validated);
        return new TaskResource($task);
    }


 public function destroy($id)
    {
        $task = $this->findTaskForUser($id);

        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted']);
    }

    public function filterByStatus($status)
    {
        $tasks = Task::where('status', $status)
            ->whereHas('taskList', fn($q) => $q->where('user_id', Auth::id()))
            ->paginate(5);

        return TaskResource::collection($tasks);
    }

    public function filterByPriority($priority)
    {
        $tasks = Task::where('priority', $priority)
            ->whereHas('taskList', fn($q) => $q->where('user_id', Auth::id()))
            ->paginate(5);

        return TaskResource::collection($tasks);
    }

    public function filterByCategory($id)
    {
        $tasks = Task::where('category_id', $id)
            ->whereHas('taskList', fn($q) => $q->where('user_id', Auth::id()))
            ->paginate(5);

        return TaskResource::collection($tasks);
    }

    public function getByTaskList($id)
    {
        $tasks = Task::where('task_list_id', $id)
            ->whereHas('taskList', fn($q) => $q->where('user_id', Auth::id()))
            ->with('category')
            ->paginate(5);

        return TaskResource::collection($tasks);
    }
    public function getByCategory($id)
{
    $tasks = Task::where('category_id', $id)
        ->whereHas('taskList', fn($q) => $q->where('user_id', Auth::id()))
        ->with('taskList') 
        ->paginate(5);

    return TaskResource::collection($tasks);
}

    public function dueSoon()
    {
        $today = now();
        $tasks = Task::whereBetween('deadline', [$today, $today->copy()->addDays(7)])
            ->whereHas('taskList', fn($q) => $q->where('user_id', Auth::id()))
            ->paginate(5);

        return TaskResource::collection($tasks);
    }

    public function search(Request $request)
{
    $query = Task::query();

    $query->whereHas('taskList', fn($q) => $q->where('user_id', Auth::id()));

    
    if ($search = $request->query('query')) {
        $queryLower = strtolower($search);
        $query->where(function($q) use ($queryLower) {
            $q->whereRaw('LOWER(title) LIKE ?', ["%{$queryLower}%"])
              ->orWhereRaw('LOWER(description) LIKE ?', ["%{$queryLower}%"]);
        });
    }

    if ($priority = $request->query('priority')) {
        $query->where('priority', $priority);
    }
    
    if ($status = $request->query('status')) {
       $query->where('status', $status);
    }

    $sortBy = $request->query('sort_by', 'created_at');
    $direction = $request->query('direction', 'desc');

    $tasks = $query->orderBy($sortBy, $direction)->paginate(5);

    return TaskResource::collection($tasks);
}
 

    public function export()
    {
        $tasks = Task::with(['category', 'taskList'])
            ->whereHas('taskList', fn($q) => $q->where('user_id', Auth::id()))
            ->get();

        $csv = "ID,Title,Status,Priority,Deadline,Category,TaskList\n";

        foreach ($tasks as $task) {
            $csv .= "{$task->id},\"{$task->title}\",{$task->status},{$task->priority},{$task->deadline},"
                . ($task->category->name ?? 'N/A') . ","
                . ($task->taskList->name ?? 'N/A')
                . "\n";
        }
       
        return Response::make($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="tasks_export.csv"',
        ]);
    }


}

