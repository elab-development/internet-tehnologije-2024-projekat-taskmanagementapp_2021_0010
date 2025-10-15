<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
         'task_list_id' => \App\Models\TaskList::factory(),
        'category_id' => \App\Models\TaskCategory::factory(),
        'title' => $this->faker->sentence(3),
        'description' => $this->faker->paragraph(),
        'priority' => $this->faker->randomElement(['nizak', 'srednji', 'visok','hitno']),
        'status' => $this->faker->randomElement(['započet', 'u toku', 'završen']),
        'deadline' => $this->faker->dateTimeBetween('-1 years', '+1 month'),
        'estimated_hours' => $this->faker->numberBetween(1, 20), // <--- NOVO

        ];
    }
}
