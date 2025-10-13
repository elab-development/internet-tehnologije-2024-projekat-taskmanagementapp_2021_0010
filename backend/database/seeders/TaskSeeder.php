<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\TaskList;
use App\Models\TaskCategory;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $lists = TaskList::all();
        $categories = TaskCategory::all();

        foreach ($lists as $list) {
            Task::factory()->count(5)->create([
                'task_list_id' => $list->id,
                'category_id' => $categories->random()->id, // nasumična kategorija
            ]);
        }
    }
}
