<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MandatoryInfoConsent extends Model
{
    protected $fillable = [
        'registration_id', 'patient_id',
        'rights_informed', 'obligations_informed',
        'service_info_given', 'general_consent',
        'consent_signature_file', 'informed_by', 'informed_at',
    ];

    protected function casts(): array
    {
        return [
            'rights_informed' => 'boolean',
            'obligations_informed' => 'boolean',
            'service_info_given' => 'boolean',
            'general_consent' => 'boolean',
            'informed_at' => 'datetime',
        ];
    }

    public function registration(): BelongsTo
    {
        return $this->belongsTo(Registration::class);
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }
}
