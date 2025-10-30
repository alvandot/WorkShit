<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Routing\Controller;
use Symfony\Component\HttpFoundation\Response;

class DashboardKpiController extends Controller
{
    /**
     * Return dashboard KPIs for all sections.
     */
    public function index(Request $request): Response
    {
        // In a real app, fetch from DB. Here, static for demo.
        $data = [
            'neonFusion' => [
                ['label' => 'Global Reach', 'value' => '72 Countries', 'icon' => 'Globe', 'trend' => '+3', 'description' => 'new countries this month'],
                ['label' => 'Knowledge Base', 'value' => '1,204', 'icon' => 'BookOpen', 'trend' => '+120', 'description' => 'articles published'],
                ['label' => 'Design Variants', 'value' => '18', 'icon' => 'Palette', 'trend' => '+2', 'description' => 'new themes'],
                ['label' => 'Active Users', 'value' => 1287, 'icon' => 'Users', 'trend' => '+4.2%', 'description' => 'in the last 24 hours'],
            ],
            'editorialGrid' => [
                ['label' => 'Writers', 'value' => 42, 'icon' => 'Users', 'trend' => '+3', 'description' => 'joined this month'],
                ['label' => 'Articles', 'value' => '1,204', 'icon' => 'BookOpen', 'trend' => '+120', 'description' => 'published'],
                ['label' => 'Regions', 'value' => '18', 'icon' => 'Globe', 'trend' => '+2', 'description' => 'new regions'],
                ['label' => 'Themes', 'value' => '7', 'icon' => 'Palette', 'trend' => '+1', 'description' => 'added'],
            ],
            'minimalistSplit' => [
                ['label' => 'Collaborators', 'value' => 19, 'icon' => 'Users', 'trend' => '+2', 'description' => 'joined this week'],
                ['label' => 'Docs', 'value' => '312', 'icon' => 'BookOpen', 'trend' => '+8', 'description' => 'pages updated'],
                ['label' => 'Continents', 'value' => '5', 'icon' => 'Globe', 'trend' => 'stable', 'description' => 'coverage'],
                ['label' => 'Palettes', 'value' => '4', 'icon' => 'Palette', 'trend' => '+1', 'description' => 'added'],
            ],
        ];
        return response()->json($data);
    }
}
