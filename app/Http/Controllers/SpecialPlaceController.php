<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSpecialPlaceRequest;
use App\Http\Requests\UpdateSpecialPlaceRequest;
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
            $query->search($search);
        }

        if ($request->filled('status')) {
            $status = strtolower($request->string('status')->toString());
            if ($status === 'active') {
                $query->active();
            } elseif ($status === 'inactive') {
                $query->inactive();
            }
        }

        if ($request->filled('province')) {
            $query->byProvince($request->integer('province'));
        }

        $specialPlaces = $query
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        $stats = [
            'total' => SpecialPlace::count(),
            'active' => SpecialPlace::active()->count(),
            'unassigned' => SpecialPlace::unassigned()->count(),
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
    public function store(StoreSpecialPlaceRequest $request): RedirectResponse
    {
        SpecialPlace::create($request->validated());

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
    public function update(UpdateSpecialPlaceRequest $request, SpecialPlace $specialPlace): RedirectResponse
    {
        $specialPlace->update($request->validated());

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
