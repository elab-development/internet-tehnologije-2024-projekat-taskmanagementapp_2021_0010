<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\v1\UserController;
use App\Http\Controllers\Api\v1\TaskListController;
use App\Http\Controllers\Api\v1\TaskController;
use App\Http\Controllers\Api\v1\TaskCategoryController;

Route::prefix('v1')->group(function () {
  // 3 različite API rute (van resource)
    Route::get('tasks/status/{status}', [TaskController::class, 'filterByStatus']);
    Route::get('tasks/priority/{priority}', [TaskController::class, 'filterByPriority']);
    Route::get('tasks/search', [TaskController::class, 'search']);

    Route::get('tasks/export', [TaskController::class, 'export']);

 //dodate rute za filtriranje
    Route::get('tasks/category/{id}', [TaskController::class, 'filterByCategory']);
    Route::get('users/{id}/task-lists', [TaskListController::class, 'getByUser']);
    Route::get('task-lists/{id}/tasks', [TaskController::class, 'getByTaskList']);
    // Zadaci kojima ističe rok za 7 dana
    Route::get('tasks/due-soon', [TaskController::class, 'dueSoon']);
    



  // Jedna RESOURCE ruta (za tasks)
    Route::apiResource('tasks', TaskController::class);

    // Ostale RESOURCE rute (dodatno)
    Route::apiResource('users', UserController::class);
    Route::apiResource('task-lists', TaskListController::class);
    Route::apiResource('task-categories', TaskCategoryController::class);
   


    
});



