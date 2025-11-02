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

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }

    public function scopeWithSpecialPlaces($query)
    {
        return $query->whereHas('specialPlaces');
    }

    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('employee_code', 'like', "%{$search}%");
        });
    }

    public function scopeByProvince($query, int $provinceId)
    {
        return $query->where('primary_province_id', $provinceId);
    }
}
