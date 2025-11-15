<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TaskList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;


class DashboardController extends Controller
{

  public function stats()
{
    $userId = Auth::id();

    // Citati API
    try {
        $response = Http::timeout(5)->get('https://zenquotes.io/api/random');
        $quoteData = $response->json()[0];
    } catch (\Exception $e) {
        $quoteData = ['q' => 'Stay motivated!', 'a' => 'System'];
    }

    return response()->json([
        'totalTasks' => Task::whereHas('taskList', fn($q) => 
            $q->where('user_id', $userId)
        )->count(),

        'totalLists' => TaskList::where('user_id', $userId)->count(),

        'completed' => Task::whereHas('taskList', fn($q) =>
            $q->where('user_id', $userId)
        )->where('status', 'završen')->count(),

        'emergency' => Task::whereHas('taskList', fn($q) =>
            $q->where('user_id', $userId)
        )->where('priority', 'hitno')->count(),

        'motivation' => [
            'quote' => $quoteData['q'],
            'author' => $quoteData['a'],
        ]
    ]);
}


    /**
     * Tasks in progress for the logged-in user
     */
public function tasksInProgress()
{
    $userId = Auth::id();

    $tasks = Task::whereHas('taskList', fn($q) =>
        $q->where('user_id', $userId)
    )
    ->where('status', 'u toku')
    ->orderBy('deadline', 'asc')
    ->paginate(5);

    return response()->json($tasks);
}




//     public function stats()
//     {

//          // Poziv ZenQuotes API-ja, šalje GET zahtev ka URL-u.
//         try {
//           $response = Http::timeout(5)->get('https://zenquotes.io/api/random');
//           $quoteData = $response->json()[0];
//             } catch (\Exception $e) {
//          $quoteData = ['q' => 'Stay motivated!', 'a' => 'System'];
// }


//         return response()->json([
//             'totalTasks' => Task::count(),
//             'totalLists' => TaskList::count(),
//             'completed' => Task::where('status', 'završen')->count(),
//             'emergency' => Task::where('priority', 'hitno')->count(),
//             //Ubaci i na frontu
//             'motivation' => [
//                 'quote' => $quoteData['q'],
//                 'author' => $quoteData['a']
//             ]
//         ]);
//     }

//    public function tasksInProgress()
// {
//     $tasks = Task::where('status', 'u toku')
//             ->orderBy('deadline', 'asc')
//             ->paginate(5); 

//         return response()->json($tasks);
// }

}
