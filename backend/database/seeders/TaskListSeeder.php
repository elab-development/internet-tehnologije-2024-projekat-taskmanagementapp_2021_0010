<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\TaskList;
class TaskListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
//“Za svaku od te 3 liste, postavi user_id = ID trenutnog korisnika iz petlje.”
        foreach ($users as $user) {
            TaskList::factory()->count(3)->create([
                'user_id' => $user->id,
            ]);
            //Sve ostalo što nisi ručno prosledila — Laravel automatski generiše pomoću Faker-a.
        }
    }
}
