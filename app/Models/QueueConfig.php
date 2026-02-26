<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QueueConfig extends Model
{
    protected $fillable = ['config_key', 'config_value', 'description', 'updated_by'];

    public static function getValue(string $key, string $default = ''): string
    {
        $config = static::where('config_key', $key)->first();
        return $config ? $config->config_value : $default;
    }

    public static function setValue(string $key, string $value, ?int $userId = null): void
    {
        static::updateOrCreate(
            ['config_key' => $key],
            ['config_value' => $value, 'updated_by' => $userId]
        );
    }
}
