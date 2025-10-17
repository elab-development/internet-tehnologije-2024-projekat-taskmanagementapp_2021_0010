<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TaskList;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'totalTasks' => Task::count(),
            'totalLists' => TaskList::count(),
            'completed' => Task::where('status', 'završen')->count(),
            'emergency' => Task::where('priority', 'hitno')->count(),
        ]);
    }

   public function tasksInProgress()
{
    $tasks = Task::where('status', 'u toku')
            ->orderBy('deadline', 'asc')
            ->paginate(5); 

        return response()->json($tasks);
}

}
