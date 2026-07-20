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
        Schema::create('categoria_tag', function (Blueprint $table) {
            $table->foreignId('categoria_id')->onDelete('cascade');
            $table->foreign('categoria_id')->references('id')->on('categorias');
            $table->foreignId('tag_id')->onDelete('cascade');;
            $table->foreign('tag_id')->references('id')->on('tags');
            $table->primary(['categoria_id', 'tag_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categoria_tag');
    }
};
