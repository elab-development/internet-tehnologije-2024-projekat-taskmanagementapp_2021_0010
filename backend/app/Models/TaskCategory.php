<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskCategory extends Model
{
    /** @use HasFactory<\Database\Factories\TaskCategoryFactory> */
    use HasFactory;
    public function tasks()
{
    return $this->hasMany(Task::class, 'category_id');
}

}
