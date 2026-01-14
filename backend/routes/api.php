<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\TaskListController;
use App\Http\Controllers\Api\V1\TaskController;
use App\Http\Controllers\Api\V1\TaskCategoryController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardController;


Route::prefix('v1')->group(function () {

    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
    });
    Route::middleware(['auth:sanctum', 'role:user'])->group(function () {
        Route::get('tasks/search', [TaskController::class, 'search']);
        Route::get('tasks/export', [TaskController::class, 'export']);
        Route::get('tasks/due-soon', [TaskController::class, 'dueSoon']);
        Route::get('user', [UserController::class, 'showMe']);
        Route::put('user', [UserController::class, 'updateMe']);
        Route::apiResource('tasks', TaskController::class);
        Route::apiResource('task-lists', TaskListController::class);
        Route::apiResource('task-categories', TaskCategoryController::class);
        Route::get('tasks/status/{status}', [TaskController::class, 'filterByStatus']);
        Route::get('tasks/priority/{priority}', [TaskController::class, 'filterByPriority']);
        
        Route::get('tasks/category/{id}', [TaskController::class, 'filterByCategory']);
        Route::get('task-lists/{id}/tasks', [TaskController::class, 'getByTaskList']);
        Route::get('task-categories/{id}/tasks', [TaskController::class, 'getByCategory']);
        Route::get('/dashboard-stats', [DashboardController::class, 'stats']);
        Route::get('/tasks-in-progress', [DashboardController::class, 'tasksInProgress']);
        Route::get('/holidays-tasks', [DashboardController::class, 'holidaysAndTasks']);

    });

    Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
        Route::apiResource('users', UserController::class);
    });

});




