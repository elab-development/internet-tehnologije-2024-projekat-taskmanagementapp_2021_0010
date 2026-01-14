<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
    Schema::create('tasks', function (Blueprint $table) {
    $table->id();
    $table->foreignId('task_list_id')->constrained()->onDelete('cascade');
    $table->foreignId('category_id')->nullable()->constrained('task_categories')->onDelete('set null');
    $table->string('title');
    $table->text('description')->nullable();
    $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
    $table->enum('status', ['started', 'in progress', 'finished'])->default('started');
    $table->date('deadline')->nullable();
    $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
