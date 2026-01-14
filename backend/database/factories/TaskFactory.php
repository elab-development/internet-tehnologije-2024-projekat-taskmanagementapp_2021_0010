<?php

namespace Database\Factories;
use App\Models\TaskCategory;
use App\Models\TaskList;
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
        'title' => $this->faker->sentence(3),
        'description' => $this->faker->paragraph(),
        'priority' => $this->faker->randomElement(['low', 'medium', 'high','emergency']),
        'status' => $this->faker->randomElement(['started', 'in progress', 'finished']),
        'deadline' => $this->faker->dateTimeBetween('-1 years', '+1 month'),
        'estimated_hours' => $this->faker->numberBetween(1, 20), 

        ];
    }
}
