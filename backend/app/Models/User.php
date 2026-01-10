<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

public function taskLists()
{
    return $this->hasMany(TaskList::class);
}


    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    //Dok $fillable kontroliše šta ulazi u bazu, $hidden kontroliše šta se vidi iz baze.
    //"Ove podatke drži u bazi, koristi ih za proveru, ali ih nikada ne šalji korisniku u odgovoru."
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    //Ovo je prevodilac između tvoje baze podataka i PHP-a.
    //Laravel kroz casts() određuje kako da konvertuje podatke iz baze u PHP formate automatski.
    //kada uzmeš ovaj podatak iz baze, nemoj mi ga dati kao običan tekst, nego ga pretvori u nešto pametnije.
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
        //Automatski hešira lozinke prilikom create/update
            'password' => 'hashed',
        ];
    }
}
