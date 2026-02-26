<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patient extends Model
{
    protected $fillable = [
        'medical_record', 'nik', 'bpjs_number', 'name',
        'birth_date', 'birth_place', 'gender', 'address',
        'rt_rw', 'kelurahan', 'kecamatan', 'kabupaten',
        'phone', 'blood_type', 'marital_status', 'occupation',
        'allergy', 'is_bpjs_active', 'bpjs_class', 'bpjs_provider',
        'bpjs_type', 'patient_type',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'is_bpjs_active' => 'boolean',
        ];
    }

    public function documents(): HasMany
    {
        return $this->hasMany(PatientDocument::class);
    }

    public function visitCards(): HasMany
    {
        return $this->hasMany(VisitCard::class);
    }

    public function queues(): HasMany
    {
        return $this->hasMany(Queue::class);
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(Registration::class);
    }

    public static function generateMedicalRecord(): string
    {
        $last = static::orderBy('id', 'desc')->first();
        $nextNum = $last ? ((int) substr($last->medical_record, 3)) + 1 : 1;
        return 'RM-' . str_pad($nextNum, 6, '0', STR_PAD_LEFT);
    }
}
