<?php

namespace App\Http\Controllers;

use App\Models\Engineer;
use App\Models\Province;
use App\Models\SpecialPlace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SpecialPlaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = SpecialPlace::query()->with(['province', 'engineer']);

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($builder) use ($search) {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhereHas('engineer', function ($relation) use ($search) {
                        $relation->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('status')) {
            $status = strtolower($request->string('status')->toString());
            if ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        if ($request->filled('province')) {
            $query->where('province_id', $request->integer('province'));
        }

        $specialPlaces = $query
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        $stats = [
            'total' => SpecialPlace::count(),
            'active' => SpecialPlace::where('is_active', true)->count(),
            'unassigned' => SpecialPlace::whereNull('engineer_id')->count(),
        ];

        return Inertia::render('special-places/index', [
            'specialPlaces' => $specialPlaces,
            'filters' => [
                'search' => $request->input('search'),
                'status' => $request->input('status'),
                'province' => $request->input('province'),
            ],
            'provinces' => Province::orderBy('name')->get(['id', 'name', 'code']),
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('special-places/create', [
            'provinces' => Province::orderBy('name')->get(['id', 'name', 'code']),
            'engineers' => Engineer::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'province_id' => 'required|exists:provinces,id',
            'engineer_id' => 'nullable|exists:engineers,id',
            'city' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'contact_person' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'is_active' => 'sometimes|boolean',
            'notes' => 'nullable|string',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);

        SpecialPlace::create($validated);

        return redirect()->route('special-places.index')->with('success', 'Special Place created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SpecialPlace $specialPlace): Response
    {
        $specialPlace->load(['province', 'engineer']);

        return Inertia::render('special-places/edit', [
            'specialPlace' => $specialPlace,
            'provinces' => Province::orderBy('name')->get(['id', 'name', 'code']),
            'engineers' => Engineer::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SpecialPlace $specialPlace): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'province_id' => 'required|exists:provinces,id',
            'engineer_id' => 'nullable|exists:engineers,id',
            'city' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'contact_person' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'is_active' => 'sometimes|boolean',
            'notes' => 'nullable|string',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);

        $specialPlace->update($validated);

        return redirect()->route('special-places.index')->with('success', 'Special Place updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SpecialPlace $specialPlace): RedirectResponse
    {
        $specialPlace->delete();

        return redirect()->route('special-places.index')->with('success', 'Special Place removed successfully.');
    }
}
