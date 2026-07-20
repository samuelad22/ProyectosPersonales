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
        Schema::create('inscripciones', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('evento_id')->constrained('eventos')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->integer('acompañantes');
            $table->string('email');
            $table->string('qr_token')->unique()->nullable();
            $table->boolean('qr_usado')->default(false);
            //$table->integer('inscritosRealizados');
            //$table->integer('inscritosPendientes');
            $table->string("paypalToken")->nullable();
            $table->string('mensaje')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscripciones');
    }
};
