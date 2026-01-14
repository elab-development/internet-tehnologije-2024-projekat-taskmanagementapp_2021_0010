<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; 

return new class extends Migration
{
    public function up(): void
    { //DB::unprepared je specifična komanda koja kaže Laravelu: "Uzmi ovaj SQL kod i pošalji ga bazi tačno takvog kakav jeste, bez ikakve obrade, provere ili pokušaja da u njega ubaciš promenljive."
        DB::unprepared("
            CREATE TRIGGER after_task_status_update
            AFTER UPDATE ON tasks
            FOR EACH ROW
            BEGIN
                IF OLD.status <> NEW.status THEN
                    INSERT INTO task_status_logs (task_id, old_status, new_status, changed_at)
                    VALUES (OLD.id, OLD.status, NEW.status, NOW());
                END IF;
            END
        ");
    }

    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS after_task_status_update');
    }
};