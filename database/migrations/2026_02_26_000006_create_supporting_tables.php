<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Patient Documents (KTP, KK, BPJS, KIA)
        Schema::create('patient_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->string('document_type', 20); // ktp, kk, bpjs_card, kia
            $table->string('file_path', 255);
            $table->string('file_name', 255)->nullable();
            $table->integer('file_size')->nullable();
            $table->foreignId('uploaded_by')->nullable()->constrained('users');
            $table->timestamps();

            $table->index('patient_id');
        });

        // Visit Cards (Kartu Kunjungan)
        Schema::create('visit_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients');
            $table->string('card_number', 20)->unique();
            $table->date('issued_date')->useCurrent();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Mandatory Info Consents
        Schema::create('mandatory_info_consents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('registration_id')->constrained('registrations')->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained('patients');
            $table->boolean('rights_informed')->default(false);
            $table->boolean('obligations_informed')->default(false);
            $table->boolean('service_info_given')->default(false);
            $table->boolean('general_consent')->default(false);
            $table->string('consent_signature_file', 255)->nullable();
            $table->foreignId('informed_by')->nullable()->constrained('users');
            $table->timestamp('informed_at')->nullable();
            $table->timestamps();
        });

        // BPJS Logs
        Schema::create('bpjs_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->nullable()->constrained('patients');
            $table->foreignId('registration_id')->nullable()->constrained('registrations');
            $table->string('action_type', 50);
            $table->string('api_endpoint', 255)->nullable();
            $table->string('http_method', 10)->nullable();
            $table->json('request_body')->nullable();
            $table->json('response_body')->nullable();
            $table->integer('status_code')->nullable();
            $table->boolean('is_success')->default(false);
            $table->text('error_message')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->timestamps();

            $table->index('patient_id');
            $table->index('created_at');
        });

        // Queue Configs
        Schema::create('queue_configs', function (Blueprint $table) {
            $table->id();
            $table->string('config_key', 50)->unique();
            $table->string('config_value', 255);
            $table->text('description')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();
        });

        // BPJS Configs
        Schema::create('bpjs_configs', function (Blueprint $table) {
            $table->id();
            $table->string('config_key', 50)->unique();
            $table->text('config_value');
            $table->boolean('is_encrypted')->default(false);
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();
        });

        // Audit Logs
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->string('action', 50);
            $table->string('table_name', 100)->nullable();
            $table->unsignedBigInteger('record_id')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('created_at');
        });

        // Notifications
        Schema::create('notifications_queue', function (Blueprint $table) {
            $table->id();
            $table->foreignId('queue_id')->nullable()->constrained('queues');
            $table->foreignId('patient_id')->nullable()->constrained('patients');
            $table->string('type', 50); // queue_approaching, queue_called, queue_skipped
            $table->string('title', 255)->nullable();
            $table->text('message')->nullable();
            $table->string('channel', 20)->nullable(); // web, whatsapp, push
            $table->string('phone_number', 20)->nullable();
            $table->boolean('is_sent')->default(false);
            $table->boolean('is_read')->default(false);
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications_queue');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('bpjs_configs');
        Schema::dropIfExists('queue_configs');
        Schema::dropIfExists('bpjs_logs');
        Schema::dropIfExists('mandatory_info_consents');
        Schema::dropIfExists('visit_cards');
        Schema::dropIfExists('patient_documents');
    }
};
