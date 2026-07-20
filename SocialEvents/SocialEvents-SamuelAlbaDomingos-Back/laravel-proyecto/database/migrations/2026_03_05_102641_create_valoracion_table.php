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
        Schema::create('valoraciones', function (Blueprint $table) {
            $table->id();
            $table->date('fecha');
            $table->longText('contenido')->nullable();
            $table->integer('puntuacion')->nullable()->min(1)->max(5);
            $table->foreignId('user_id')->onDelete('cascade');;
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreignId('evento_id')->onDelete('cascade');
            $table->foreign('evento_id')->references('id')->on('eventos');
            $table->unique(['user_id', 'evento_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('valoraciones');
    }
};
