<?php

namespace App\Http\Controllers;

use App\Models\Engineer;
use App\Models\Province;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EngineerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Engineer::query()->with(['primaryProvince', 'specialPlaces']);

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($builder) use ($search) {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('employee_code', 'like', "%{$search}%");
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

        $engineers = $query
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        $stats = [
            'total' => Engineer::count(),
            'active' => Engineer::where('is_active', true)->count(),
            'with_special_places' => Engineer::whereHas('specialPlaces')->count(),
        ];

        return Inertia::render('engineers/index', [
            'engineers' => $engineers,
            'filters' => [
                'search' => $request->input('search'),
                'status' => $request->input('status'),
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('engineers/create', [
            'provinces' => Province::query()
                ->orderBy('name')
                ->get(['id', 'name', 'code']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'employee_code' => 'nullable|string|max:50|unique:engineers,employee_code',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255|unique:engineers,email',
            'phone' => 'nullable|string|max:50',
            'phone_number' => 'nullable|string|max:20',
            'specialization' => 'nullable|string|max:255',
            'experience_years' => 'nullable|integer|min:0|max:60',
            'primary_province_id' => 'nullable|exists:provinces,id',
            'hired_at' => 'nullable|date',
            'is_active' => 'sometimes|boolean',
            'notes' => 'nullable|string',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);

        Engineer::create($validated);

        return redirect()
            ->route('engineers.index')
            ->with('success', 'Engineer created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Engineer $engineer): Response
    {
        $engineer->load(['primaryProvince', 'specialPlaces.province']);

        return Inertia::render('engineers/edit', [
            'engineer' => $engineer,
            'provinces' => Province::query()
                ->orderBy('name')
                ->get(['id', 'name', 'code']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Engineer $engineer): RedirectResponse
    {
        $validated = $request->validate([
            'employee_code' => 'nullable|string|max:50|unique:engineers,employee_code,'.$engineer->id,
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255|unique:engineers,email,'.$engineer->id,
            'phone' => 'nullable|string|max:50',
            'phone_number' => 'nullable|string|max:20',
            'specialization' => 'nullable|string|max:255',
            'experience_years' => 'nullable|integer|min:0|max:60',
            'primary_province_id' => 'nullable|exists:provinces,id',
            'hired_at' => 'nullable|date',
            'is_active' => 'sometimes|boolean',
            'notes' => 'nullable|string',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);

        $engineer->update($validated);

        return redirect()
            ->route('engineers.index')
            ->with('success', 'Engineer updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Engineer $engineer): RedirectResponse
    {
        $engineer->delete();

        return redirect()
            ->route('engineers.index')
            ->with('success', 'Engineer removed successfully.');
    }
}
