<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BpjsLog extends Model
{
    protected $fillable = [
        'patient_id', 'registration_id', 'action_type',
        'api_endpoint', 'http_method', 'request_body', 'response_body',
        'status_code', 'is_success', 'error_message', 'user_id',
    ];

    protected function casts(): array
    {
        return [
            'request_body' => 'array',
            'response_body' => 'array',
            'is_success' => 'boolean',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function registration(): BelongsTo
    {
        return $this->belongsTo(Registration::class);
    }
}
