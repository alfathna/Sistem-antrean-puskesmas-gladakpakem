<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Registration extends Model
{
    protected $fillable = [
        'registration_number', 'queue_id', 'patient_id',
        'registration_date', 'registration_time', 'patient_type', 'payment_type',
        'bpjs_verified', 'bpjs_verification_time', 'bpjs_status',
        'bpjs_bridged', 'bpjs_visit_id', 'bpjs_bridge_time',
        'rm_status', 'rm_delivered_at', 'info_consent_completed',
        'poly_id', 'doctor_id', 'status', 'registered_by',
        'completed_at', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'registration_date' => 'date',
            'bpjs_verified' => 'boolean',
            'bpjs_verification_time' => 'datetime',
            'bpjs_bridged' => 'boolean',
            'bpjs_bridge_time' => 'datetime',
            'rm_delivered_at' => 'datetime',
            'info_consent_completed' => 'boolean',
            'completed_at' => 'datetime',
        ];
    }

    public function queue(): BelongsTo
    {
        return $this->belongsTo(Queue::class);
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function polyclinic(): BelongsTo
    {
        return $this->belongsTo(Polyclinic::class, 'poly_id');
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

    public function registeredByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'registered_by');
    }

    public function consent()
    {
        return $this->hasOne(MandatoryInfoConsent::class);
    }

    public static function generateNumber(): string
    {
        $date = now()->format('Ymd');
        $last = static::where('registration_number', 'like', "REG-{$date}-%")
            ->orderBy('id', 'desc')
            ->first();

        $nextNum = 1;
        if ($last) {
            $parts = explode('-', $last->registration_number);
            $nextNum = ((int) end($parts)) + 1;
        }

        return "REG-{$date}-" . str_pad($nextNum, 4, '0', STR_PAD_LEFT);
    }
}
