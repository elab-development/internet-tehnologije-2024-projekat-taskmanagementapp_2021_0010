<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // MySQL ne podržava check preko Blueprint-a, zato radimo raw SQL
        //DB::statement(kad koristimo raw sql): Govori Laravelu: "Pusti me da ja sam napišem tačnu SQL komandu, ti je samo prosledi bazi
        DB::statement("
            ALTER TABLE tasks 
            ADD CONSTRAINT chk_tasks_priority
            CHECK (priority IN ('low', 'medium', 'high', 'emergency'))
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE tasks 
            DROP CHECK chk_tasks_priority
        ");
    }
};
