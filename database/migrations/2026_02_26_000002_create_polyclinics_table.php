<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('polyclinics', function (Blueprint $table) {
            $table->id();
            $table->string('code', 10)->unique();
            $table->string('name', 100);
            $table->string('bpjs_poly_code', 10)->nullable();
            $table->string('room', 50)->nullable();
            $table->string('queue_prefix', 5); // A, B, C, D, E
            $table->integer('quota_per_day')->default(30);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('polyclinics');
    }
};
