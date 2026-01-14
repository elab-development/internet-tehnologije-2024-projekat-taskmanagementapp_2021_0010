<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory;
    
    protected $fillable = [
        'task_list_id',
        'category_id',
        'title',
        'description',
        'priority',
        'status',
        'deadline',
        'estimated_hours'
    ];
 
    public function taskList()
{
    return $this->belongsTo(TaskList::class);
}

public function category()
{
    return $this->belongsTo(TaskCategory::class);
                                              
}

}
