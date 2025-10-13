<?php

namespace App\Http\Controllers;

use App\Models\TaskList;
use App\Http\Requests\StoreTaskListRequest;
use App\Http\Requests\UpdateTaskListRequest;

class TaskListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskListRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(TaskList $taskList)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TaskList $taskList)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskListRequest $request, TaskList $taskList)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TaskList $taskList)
    {
        //
    }
}
