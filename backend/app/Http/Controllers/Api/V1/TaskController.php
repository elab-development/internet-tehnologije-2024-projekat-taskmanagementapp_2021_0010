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
//Tvoja funkcija findTaskForUser radi dvostruku proveru:
//Da li zadatak postoji?
//Da li zadatak pripada tebi (preko liste)
     private function findTaskForUser($taskId)
    {                           //$q predstavlja upit nad povezanom tabelom – u ovom slučaju nad task_lists tabelom.
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
      //"Daj mi zadatke koji se nalaze u listama čiji je vlasnik ovaj korisnik
        ->whereHas('taskList', fn($q) => $q->where('user_id', $user->id))
        ->paginate(5);

      return TaskResource::collection($tasks);
    }

    public function store(Request $request)
    {
         $validated = $request->validate([
               //Proverava da li u tabeli task_lists uopšte postoji red sa tim ID-jem
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
                                     //Koristi se copy() jer now() u Laravelu (Carbon biblioteka) menja originalni objekat. Ovako si siguran da tvoj originalni $today ostaje netaknut.
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
    //Vraća Eloquent Query Builder za model Task
   //To je “prazan” upit nad tabelom tasks
   //Na taj objekat kasnije dodaješ uslove
    $query = Task::query();

    // zadrži samo one taskove koji pripadaju task listama trenutno ulogovanog korisnika.
    $query->whereHas('taskList', fn($q) => $q->where('user_id', Auth::id()));

    // 2. Grupisanje pretrage (da OR ne "pobegne" van user_id uslova)
    //Ova linija uzima vrednost parametra iz URL-a (query stringa).
                            //query('query') → čita GET parametar po imenu query
    if ($search = $request->query('query')) {
        $queryLower = strtolower($search);
        //Ova anonimna funkcija služi za GRUPISANJE uslova isto kao zagrade ( ) u SQL-u.Bez nje → OR razbije logiku upita.
                                   //use ($queryLower) → omogućava korišćenje promenljive iz spoljnog scope-a
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
       //200: Standardni HTTP statusni kod za "OK"
       //[...]: Treći parametar je niz zaglavlja koja šalješ browseru
        return Response::make($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="tasks_export.csv"',
        ]);
    }


}

