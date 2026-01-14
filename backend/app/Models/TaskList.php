<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskList extends Model
{
    /** @use HasFactory<\Database\Factories\TaskListFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'is_favorite',
    ];

    public function user()
{
    return $this->belongsTo(User::class);
}

public function tasks()
{
    return $this->hasMany(Task::class);
}

}
