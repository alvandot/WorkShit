<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEngineerRequest;
use App\Http\Requests\UpdateEngineerRequest;
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

        $engineers = $query
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        $stats = [
            'total' => Engineer::count(),
            'active' => Engineer::active()->count(),
            'with_special_places' => Engineer::withSpecialPlaces()->count(),
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
    public function store(StoreEngineerRequest $request): RedirectResponse
    {
        Engineer::create($request->validated());

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
    public function update(UpdateEngineerRequest $request, Engineer $engineer): RedirectResponse
    {
        $engineer->update($request->validated());

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
