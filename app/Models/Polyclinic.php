<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Polyclinic extends Model
{
    protected $fillable = [
        'code', 'name', 'bpjs_poly_code', 'room',
        'queue_prefix', 'quota_per_day', 'is_active', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function doctors(): HasMany
    {
        return $this->hasMany(Doctor::class, 'poly_id');
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(DoctorSchedule::class, 'poly_id');
    }

    public function queues(): HasMany
    {
        return $this->hasMany(Queue::class, 'poly_id');
    }

    public function todayQueues()
    {
        return $this->queues()->where('queue_date', now()->toDateString());
    }
}
