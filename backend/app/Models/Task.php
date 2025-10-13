<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory;
    public function taskList()
{
    return $this->belongsTo(TaskList::class);
}

public function category()
{
    return $this->belongsTo(TaskCategory::class, 'category_id');
}

}
