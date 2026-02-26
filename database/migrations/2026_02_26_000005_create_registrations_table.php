<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registrations', function (Blueprint $table) {
            $table->id();
            $table->string('registration_number', 30)->unique(); // REG-20260226-0001
            $table->foreignId('queue_id')->nullable()->constrained('queues');
            $table->foreignId('patient_id')->constrained('patients');
            $table->date('registration_date')->useCurrent();
            $table->time('registration_time')->nullable();
            $table->string('patient_type', 10);       // baru, lama
            $table->string('payment_type', 10);       // bpjs, umum

            // BPJS Verification
            $table->boolean('bpjs_verified')->default(false);
            $table->timestamp('bpjs_verification_time')->nullable();
            $table->string('bpjs_status', 20)->nullable(); // aktif, tidak_aktif, not_checked

            // BPJS Bridging
            $table->boolean('bpjs_bridged')->default(false);
            $table->string('bpjs_visit_id', 50)->nullable();
            $table->timestamp('bpjs_bridge_time')->nullable();

            // Rekam Medis
            $table->string('rm_status', 20)->default('pending'); // pending, created, retrieved, delivered
            $table->timestamp('rm_delivered_at')->nullable();

            // Info Wajib
            $table->boolean('info_consent_completed')->default(false);

            // Poli Tujuan
            $table->foreignId('poly_id')->nullable()->constrained('polyclinics');
            $table->foreignId('doctor_id')->nullable()->constrained('doctors');

            // Status
            $table->string('status', 20)->default('processing'); // processing, completed, cancelled
            $table->foreignId('registered_by')->nullable()->constrained('users');
            $table->timestamp('completed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('registration_date');
            $table->index('patient_id');
            $table->index('queue_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registrations');
    }
};
