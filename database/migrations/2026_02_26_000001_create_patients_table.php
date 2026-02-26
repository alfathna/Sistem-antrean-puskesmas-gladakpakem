<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('medical_record', 20)->unique();
            $table->string('nik', 16)->unique()->nullable();
            $table->string('bpjs_number', 20)->nullable();
            $table->string('name', 255);
            $table->date('birth_date')->nullable();
            $table->string('birth_place', 100)->nullable();
            $table->string('gender', 1)->nullable(); // L / P
            $table->text('address')->nullable();
            $table->string('rt_rw', 10)->nullable();
            $table->string('kelurahan', 100)->nullable();
            $table->string('kecamatan', 100)->nullable();
            $table->string('kabupaten', 100)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('blood_type', 3)->nullable();
            $table->string('marital_status', 20)->nullable();
            $table->string('occupation', 100)->nullable();
            $table->text('allergy')->nullable();
            $table->boolean('is_bpjs_active')->default(false);
            $table->string('bpjs_class', 5)->nullable();
            $table->string('bpjs_provider', 100)->nullable();
            $table->string('bpjs_type', 50)->nullable();
            $table->string('patient_type', 10)->default('umum'); // umum, bpjs
            $table->timestamps();

            $table->index('bpjs_number');
            $table->index('nik');
            $table->index('name');
            $table->index('medical_record');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
