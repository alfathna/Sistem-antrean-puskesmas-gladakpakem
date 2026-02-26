<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VisitCard extends Model
{
    protected $fillable = ['patient_id', 'card_number', 'issued_date', 'is_active'];

    protected function casts(): array
    {
        return [
            'issued_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }
}
