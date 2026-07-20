<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mensajes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversacion_id')->constrained('conversaciones')->onDelete('cascade');
            $table->foreignId('remitente_id')->constrained('users')->onDelete('cascade');
            $table->text('contenido');
            $table->boolean('leido')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mensajes');
    }
};
