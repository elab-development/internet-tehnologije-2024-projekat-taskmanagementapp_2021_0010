<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    //Ova metoda se pokreće kada ukucaš php artisan migrate
   public function up(): void
    { 
        //Schema::create se koristi samo kada praviš novu tabelu.
        //Schema::table se koristi kada želiš da "uđeš" u postojeću tabelu i nešto u njoj čačkaš.
       
        Schema::table('task_categories', function (Blueprint $table) {
            $table->dropColumn('description');
        });
    }
//Ova metoda se pokreće kada ukucaš php artisan migrate:rollback
    public function down(): void
    {
        Schema::table('task_categories', function (Blueprint $table) {
            $table->text('description')->nullable();
        });
    }
};
