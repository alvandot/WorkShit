<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Province extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'source_updated_at',
    ];

    protected function casts(): array
    {
        return [
            'source_updated_at' => 'datetime',
        ];
    }

    public function engineers(): HasMany
    {
        return $this->hasMany(Engineer::class, 'primary_province_id');
    }

    public function specialPlaces(): HasMany
    {
        return $this->hasMany(SpecialPlace::class);
    }
}
