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
        Schema::create('prediccion', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_baliza')->nullable()->constrained('baliza')->onDelete('cascade');
            $table->dateTime('timestamp');
            $table->float('temperatura');
            $table->string('cielo');
            $table->integer('humedad')->unsigned();
            $table->integer('probabilidad_precipitacion')->unsigned();
            $table->float('velocidad_viento');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prediccion');
    }
};
