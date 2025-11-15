<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
        'name' => $this->faker->name(),
        //safe email- To su adrese koje ne mogu stvarno poslati poštu nikome, pa su potpuno sigurne za test podatke, baze i seed-ove.
        'email' => $this->faker->unique()->safeEmail(),
        'phone' => $this->faker->phoneNumber(),
        //laravel hešira automatski zbog 'hashed' cast-a
        'password' => 'password',
        'role' => $this->faker->randomElement(['admin', 'user', 'guest']),
    ];
        
    }

  
}
