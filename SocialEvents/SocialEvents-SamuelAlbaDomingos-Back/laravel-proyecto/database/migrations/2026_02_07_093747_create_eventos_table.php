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
        Schema::create('eventos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 60)->unique();
            $table->string('slug', 60)->unique();
            $table->string('ubicacion');
            $table->integer('aforoMaximo');
            $table->integer('aforoActual')->default(0);
            $table->date('fechaInicio');
            $table->date('fechaFin')->nullable();
            $table->string('imagen')->nullable();
            $table->time('horaInicio');
            $table->time('horaFin')->nullable();
            $table->longText('descripcion')->nullable();
            $table->decimal('precio',6,2)->default(0.00)->min(0);
            $table->string('creadorPaypal')->nullable();
            $table->decimal('dineroGenerado', 7,2)->nullable();
            $table->boolean('estadoPago')->default(false);
            $table->foreignId('categoria_id')->constrained('categorias')->onDelete('cascade');
            $table->foreignId('creador_id')->constrained('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eventos');
    }
};
