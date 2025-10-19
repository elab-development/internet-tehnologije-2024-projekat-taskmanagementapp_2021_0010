<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\v1\UserController;
use App\Http\Controllers\Api\v1\TaskListController;
use App\Http\Controllers\Api\v1\TaskController;
use App\Http\Controllers\Api\v1\TaskCategoryController;
use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\DashboardController;

Route::prefix('v1')->group(function () {

    // 🧭 JAVNE RUTE (bez autentifikacije)
    Route::get('/dashboard-stats', [DashboardController::class, 'stats']);
    Route::get('/tasks-in-progress', [DashboardController::class, 'tasksInProgress']);

    // AUTH (bez auth:sanctum)
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    // 🧭 JAVNE TASK RUTE — prikaz i filtriranje
    Route::get('tasks', [TaskController::class, 'index']);
    Route::get('tasks/{id}', [TaskController::class, 'show']);

    Route::get('tasks/status/{status}', [TaskController::class, 'filterByStatus']);
    Route::get('tasks/priority/{priority}', [TaskController::class, 'filterByPriority']);
    Route::get('tasks/search', [TaskController::class, 'search']);
    Route::get('tasks/category/{id}', [TaskController::class, 'filterByCategory']);
    Route::get('users/{id}/task-lists', [TaskListController::class, 'getByUser']);
    Route::get('task-lists/{id}/tasks', [TaskController::class, 'getByTaskList']);
    Route::get('tasks/due-soon', [TaskController::class, 'dueSoon']);

    // 🧭 JAVNE RESOURCE RUTE (samo za prikaz)
    Route::apiResource('users', UserController::class)->only(['index', 'show']);
    Route::apiResource('task-lists', TaskListController::class)->only(['index', 'show']);
    Route::apiResource('task-categories', TaskCategoryController::class)->only(['index', 'show']);

    // 🔒 ZAŠTIĆENE RUTE (autentifikacija potrebna)
    Route::middleware('auth:sanctum')->group(function () {

        // Logout
        Route::post('logout', [AuthController::class, 'logout']);

        // CRUD operacije koje menjaju bazu
        Route::post('tasks', [TaskController::class, 'store']);
        Route::put('tasks/{id}', [TaskController::class, 'update']);
        Route::delete('tasks/{id}', [TaskController::class, 'destroy']);

        // Ostali resursi ako budu potrebni
        Route::apiResource('users', UserController::class)->except(['index', 'show']);
        Route::apiResource('task-lists', TaskListController::class)->except(['index', 'show']);
        Route::apiResource('task-categories', TaskCategoryController::class)->except(['index', 'show']);
    });
});
