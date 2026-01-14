<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TaskList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


class DashboardController extends Controller
{


public function stats()
{
    $userId = Auth::id();

    try {
        $response = Http::timeout(5)->get('https://zenquotes.io/api/random');
        $quoteData = $response->json()[0];
    } catch (\Exception $e) {
        $quoteData = ['q' => 'Stay motivated!', 'a' => 'System'];
    }

    $tasksByCategory = DB::table('tasks')
        ->join('task_lists', 'tasks.task_list_id', '=', 'task_lists.id')
        ->join('task_categories', 'tasks.category_id', '=', 'task_categories.id')
        ->where('task_lists.user_id', $userId)
        ->select(
            'task_categories.name as category',
          DB::raw('COUNT(tasks.id) as total')        )
        ->groupBy('task_categories.name')
        ->get();

    $tasksByStatus = DB::table('tasks')
        ->join('task_lists', 'tasks.task_list_id', '=', 'task_lists.id')
        ->where('task_lists.user_id', $userId)
        ->select(
            'status',
            DB::raw('COUNT(*) as total')
        )
        ->groupBy('status')
        ->get();

    $tasksByPriority = DB::table('tasks')
        ->join('task_lists', 'tasks.task_list_id', '=', 'task_lists.id')
        ->where('task_lists.user_id', $userId)
        ->select(
            'priority',
            DB::raw('COUNT(*) as total')
        )
        ->groupBy('priority')
        ->get();

    return response()->json([
        'totalTasks' => Task::whereHas('taskList', fn($q) => $q->where('user_id', $userId))->count(),
        'totalLists' => TaskList::where('user_id', $userId)->count(),
        'completed' => Task::whereHas('taskList', fn($q) => $q->where('user_id', $userId))->where('status', 'finished')->count(),
        'emergency' => Task::whereHas('taskList', fn($q) => $q->where('user_id', $userId))->where('priority', 'emergency')->count(),
        'tasksByCategory' => $tasksByCategory,
        'tasksByStatus' => $tasksByStatus,
        'tasksByPriority' => $tasksByPriority,
        'motivation' => [
            'quote' => $quoteData['q'],
            'author' => $quoteData['a'],
        ]
    ]);
}


public function tasksInProgress()
{
    $userId = Auth::id();

    $tasks = Task::whereHas('taskList', fn($q) =>
        $q->where('user_id', $userId)
    )
    ->where('status', 'in progress')
    ->orderBy('deadline', 'asc')
    ->paginate(5);

    return response()->json($tasks);
}


public function holidaysAndTasks()
{
    $userId = Auth::id();

    try {
        $response = Http::timeout(5)->get('https://date.nager.at/api/v3/PublicHolidays/2026/RS');
        $holidays = $response->json(); 
    } catch (\Exception $e) {
        $holidays = [];
    }

    $tasksOnHolidays = Task::whereHas('taskList', fn($q) => $q->where('user_id', $userId))
        ->whereIn('deadline', collect($holidays)->pluck('date')->toArray())
        ->get(['title', 'deadline', 'priority']);

    return response()->json([
        'holidays' => $holidays,
        'tasks_due_on_holidays' => $tasksOnHolidays
    ]);
}


}