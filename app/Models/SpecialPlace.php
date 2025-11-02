<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SpecialPlace extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'province_id',
        'engineer_id',
        'city',
        'address',
        'contact_person',
        'contact_phone',
        'is_active',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    public function engineer(): BelongsTo
    {
        return $this->belongsTo(Engineer::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }

    public function scopeUnassigned($query)
    {
        return $query->whereNull('engineer_id');
    }

    public function scopeByProvince($query, int $provinceId)
    {
        return $query->where('province_id', $provinceId);
    }

    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('city', 'like', "%{$search}%")
                ->orWhereHas('engineer', function ($relation) use ($search) {
                    $relation->where('name', 'like', "%{$search}%");
                });
        });
    }
}
