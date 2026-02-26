<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('queues', function (Blueprint $table) {
            $table->id();
            $table->string('queue_number', 10);       // P-001, A-001, B-001
            $table->string('queue_prefix', 5);         // P, A, B, C, D, E
            $table->string('queue_category', 20);      // prioritas, umum
            $table->string('priority_reason', 50)->nullable(); // lansia, bumil, disabilitas, balita
            $table->foreignId('patient_id')->nullable()->constrained('patients')->nullOnDelete();
            $table->foreignId('poly_id')->nullable()->constrained('polyclinics');
            $table->foreignId('doctor_id')->nullable()->constrained('doctors');
            $table->date('queue_date');
            $table->string('source', 20);              // kiosk, web, mobile
            $table->string('status', 20)->default('waiting');
            // status: waiting, confirmed, called, serving, registered, directed_to_poly, done, skipped, cancelled
            $table->string('payment_type', 10)->nullable(); // bpjs, umum
            $table->integer('counter_number')->nullable();
            $table->timestamp('estimated_time')->nullable();
            $table->timestamp('called_at')->nullable();
            $table->timestamp('served_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->timestamps();

            $table->index('queue_date');
            $table->index('status');
            $table->index(['queue_category', 'queue_date']);
            $table->index(['poly_id', 'queue_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('queues');
    }
};
