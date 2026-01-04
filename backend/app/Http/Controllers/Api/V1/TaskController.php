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
      //$q predstavlja query za tu relaciju.
        ->whereHas('taskList', fn($q) => $q->where('user_id', $user->id))
        ->paginate(5);

      return TaskResource::collection($tasks);

     // return TaskResource::collection($query->paginate(5));
        // $tasks = Task::with(['category', 'taskList'])->paginate(5);
        // return TaskResource::collection($tasks);
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

        //  proveriti da li task_list pripada useru
        $taskList = TaskList::where('id', $validated['task_list_id'])
            ->where('user_id', Auth::id())
            ->first();

        if (!$taskList) {
            return response()->json(['error' => 'Forbidden: List does not belong to user'], 403);
        }

        $task = Task::create($validated);
        //Vrati JSON frontendu
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

    // -----------------------------------------------------
    // FILTERI — svi uključuju proveru vlasništva
    // -----------------------------------------------------
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

    public function dueSoon()
    {
        $today = now();

        $tasks = Task::whereBetween('deadline', [$today, $today->copy()->addDays(7)])
            ->whereHas('taskList', fn($q) => $q->where('user_id', Auth::id()))
            ->paginate(5);

        return TaskResource::collection($tasks);
    }

    // -----------------------------------------------------
    // SEARCH TASKOVA (uvek filtrira po useru!)
    // -----------------------------------------------------
    public function search(Request $request)
{
    $query = Task::query();

    // 1. Obavezan uslov za korisnika (uvek ide uz ostale)
    $query->whereHas('taskList', fn($q) => $q->where('user_id', Auth::id()));

    // 2. Grupisanje pretrage (da OR ne "pobegne" van user_id uslova)
    if ($search = $request->query('query')) {
        $queryLower = strtolower($search);
        $query->where(function($q) use ($queryLower) {
            $q->whereRaw('LOWER(title) LIKE ?', ["%{$queryLower}%"])
              ->orWhereRaw('LOWER(description) LIKE ?', ["%{$queryLower}%"]);
        });
    }

    // 3. Filteri
    if ($priority = $request->query('priority')) {
        $query->where('priority', $priority);
    }
    
    if ($status = $request->query('status')) {
       $query->where('status', $status);
    }

    $sortBy = $request->query('sort_by', 'created_at');
    $direction = $request->query('direction', 'desc');

    $tasks = $query->orderBy($sortBy, $direction)->paginate(5);

    // 4. Uvek vraćaj kolekciju (čak i ako je prazna) zbog frontenda
    return TaskResource::collection($tasks);
}
    // public function search(Request $request)
    // {
    //     $query = Task::query();

    //     $query->whereHas('taskList', fn($q) => $q->where('user_id', Auth::id()));

    //     if ($search = $request->query('query')) {
    //         $queryLower = strtolower($search);
    //         $query->whereRaw('LOWER(title) LIKE ?', ["%{$queryLower}%"])
    //               ->orWhereRaw('LOWER(description) LIKE ?', ["%{$queryLower}%"]);
    //     }

    //     if ($priority = $request->query('priority')) {
    //         $query->where('priority', $priority);
    //     }
    //     if ($status = $request->query('status')) {
    //        $query->where('status', $status);
    //      }

    //     $sortBy = $request->query('sort_by', 'created_at');
    //     $direction = $request->query('direction', 'desc');

    //     $tasks = $query->orderBy($sortBy, $direction)->paginate(5);

    //     if ($tasks->isEmpty()) {
    //         return response()->json(['message' => 'There`s no tasks fullfiling the conditions.']);
    //     }

    //     return TaskResource::collection($tasks);
    // }

    // -----------------------------------------------------
    // EXPORT CSV — samo userovi taskovi
    // -----------------------------------------------------
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

//     public function destroy($id)
//     {
//         $task = Task::find($id);
//         if (!$task) return response()->json(['error' => 'Task not found'], 404);
//         $task->delete();
//         return response()->json(['message' => 'Task deleted']);
//     }

//     public function filterByStatus($status)
//     {
//         $tasks = Task::where('status', $status)->get();
//         return response()->json($tasks);
//     }

//     public function filterByPriority($priority)
//     {
//         $tasks = Task::where('priority', $priority)->paginate(5);
//         return TaskResource::collection($tasks);
//     }

//     public function filterByCategory($id)
// {
//     $tasks = Task::where('category_id', $id)->paginate(5);
//     return TaskResource::collection($tasks);
// }

// public function getByTaskList($id)
// {
//     $tasks = Task::where('task_list_id', $id)->with(['category'])->paginate(5);
//     return TaskResource::collection($tasks);
// }

// public function dueSoon()
// {
//     $today = now();
//     $tasks = Task::where('deadline', '>=', $today)
//                  ->where('deadline', '<=', $today->copy()->addDays(7))
//                  ->paginate(5);
//         //Bez copy(), $today bi bio pomeren i mogao bi da zeznu sledeće poređenje.
//     return TaskResource::collection($tasks);
// }


//  public function search(Request $request)
// {
//     //Ovo pravi "prazan" SQL upit:
//     $query = Task::query();

//     //Filtrira sve zadatke koji u title ili description imaju tu rec
//     if ($search = $request->query('query')) {
//         $queryLower = strtolower($search);
//         $query->whereRaw('LOWER(title) LIKE ?', ["%{$queryLower}%"])
//               ->orWhereRaw('LOWER(description) LIKE ?', ["%{$queryLower}%"]);
//     }
//                     // „Uzmi vrednost iz URL-a iz GET parametra ?query=“.
//     if ($priority = $request->query('priority')) {
//         $query->where('priority', $priority);
//     }

//     $sortBy = $request->query('sort_by', 'created_at'); // default
//     $direction = $request->query('direction', 'desc'); // asc ili desc

//     $tasks = $query->orderBy($sortBy, $direction)->paginate(5);

//     if ($tasks->isEmpty()) {
//         return response()->json([
//             'message' => 'Nema zadataka koji odgovaraju pretrazi.',
//         ]);
//     }

//     return TaskResource::collection($tasks);
// }


// public function export()
// {
//     $tasks = Task::with(['category', 'taskList'])->get();

//     $csv = "ID,Title,Status,Priority,Deadline,Category,TaskList\n";

//     foreach ($tasks as $task) {
//         $category = $task->category ? $task->category->name : 'N/A';
//         $taskList = $task->taskList ? $task->taskList->name : 'N/A';

//         $csv .= "{$task->id},\"{$task->title}\",{$task->status},{$task->priority},{$task->deadline},{$category},{$taskList}\n";
//     }
// //Vraćanje CSV fajla kao download
//     return Response::make($csv, 200, [
//         'Content-Type' => 'text/csv',
//         //browser prikazuje prompt za preuzimanje sa datim imenom.
//         'Content-Disposition' => 'attachment; filename=\"tasks_export.csv\"',
//     ]);
// }

}
