<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Engineer extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_code',
        'name',
        'email',
        'phone',
        'phone_number',
        'specialization',
        'experience_years',
        'primary_province_id',
        'is_active',
        'hired_at',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'experience_years' => 'integer',
            'is_active' => 'boolean',
            'hired_at' => 'date',
        ];
    }

    public function primaryProvince(): BelongsTo
    {
        return $this->belongsTo(Province::class, 'primary_province_id');
    }

    public function specialPlaces(): HasMany
    {
        return $this->hasMany(SpecialPlace::class);
    }
}
