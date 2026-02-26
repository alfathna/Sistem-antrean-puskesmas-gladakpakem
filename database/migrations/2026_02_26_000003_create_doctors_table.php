<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name', 255);
            $table->string('nip', 30)->nullable();
            $table->string('sip_number', 50)->nullable();
            $table->string('specialization', 100)->nullable();
            $table->foreignId('poly_id')->nullable()->constrained('polyclinics');
            $table->string('bpjs_doctor_code', 20)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('doctor_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')->constrained('doctors')->cascadeOnDelete();
            $table->foreignId('poly_id')->constrained('polyclinics');
            $table->integer('day_of_week'); // 1=Monday ... 7=Sunday
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('max_patient')->default(30);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctor_schedules');
        Schema::dropIfExists('doctors');
    }
};
