import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Globe, BookOpen, Palette } from 'lucide-react';
import { useState } from 'react';

// Option 3: Minimalist Split (Slate, white, and bright accent, split layout, headings in system-ui bold, body in mono, strong left-right contrast)
const splitKpis = [
  {
    label: 'Collaborators',
    value: 19,
    icon: <Users className="size-7 text-slate-600" />,
    trend: '+2',
    description: 'joined this week',
  },
  {
    label: 'Docs',
    value: '312',
    icon: <BookOpen className="size-7 text-accent-500" />,
    trend: '+8',
    description: 'pages updated',
  },
  {
    label: 'Continents',
    value: '5',
    icon: <Globe className="size-7 text-slate-400" />,
    trend: 'stable',
    description: 'coverage',
  },
  {
    label: 'Palettes',
    value: '4',
    icon: <Palette className="size-7 text-accent-400" />,
    trend: '+1',
    description: 'added',
  },
];

export function MinimalistSplitDashboard() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-mono">
        <aside className="md:w-1/3 bg-slate-900 text-white flex flex-col justify-between py-12 px-6 md:px-10 shadow-2xl">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-accent-400">Minimalist Split</h1>
            <p className="text-base md:text-lg text-slate-200 font-normal max-w-md leading-relaxed mb-8">A dashboard with a strong left-right split, slate and white contrast, and mono body for a clean, modern, and focused look.</p>
            <div className="space-y-6">
              {splitKpis.map((kpi, idx) => (
                <Card
                  key={kpi.label}
                  className={`group relative bg-slate-800/80 border-none shadow-lg rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl focus-within:ring-2 focus-within:ring-accent-400 ${hovered === idx ? 'ring-2 ring-accent-400' : ''}`}
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(null)}
                  tabIndex={0}
                >
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="p-3 rounded-full bg-gradient-to-br from-accent-400 to-slate-700 shadow-md group-hover:scale-110 transition-transform duration-300">
                      {kpi.icon}
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-accent-200 mb-1">{kpi.value}</CardTitle>
                      <CardDescription className="text-slate-200 text-xs font-medium">{kpi.label}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <span className="text-accent-400 font-semibold text-lg">{kpi.trend}</span>
                    <span className="text-slate-300 text-xs">{kpi.description}</span>
                  </CardContent>
                  <div className="absolute inset-0 rounded-lg pointer-events-none group-hover:bg-accent-400/10 transition-colors duration-300" />
                </Card>
              ))}
            </div>
          </div>
          <footer className="mt-12 text-slate-400 text-xs">&copy; 2025 Minimalist Split Demo</footer>
        </aside>
        <main className="flex-1 flex flex-col justify-center items-center py-16 px-4 md:px-12">
          <Card className="w-full max-w-2xl bg-white border-none shadow-xl rounded-2xl transition-shadow duration-300 hover:shadow-2xl mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-900">Live Collaboration</CardTitle>
              <CardDescription className="text-slate-500">Real-time updates and mono micro-interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="bg-accent-50 text-accent-600 border-accent-400 hover:bg-accent-100 hover:text-accent-900 transition-all duration-300 shadow-md font-mono">Trigger Collaboration</Button>
              <div className="mt-6 h-24 flex items-center justify-center text-accent-400 animate-pulse font-mono text-lg">Collaboration data coming soon...</div>
            </CardContent>
          </Card>
          <Card className="w-full max-w-2xl bg-white border-none shadow-xl rounded-2xl transition-shadow duration-300 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-900">Docs Analytics</CardTitle>
              <CardDescription className="text-slate-500">Docs trends and more</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-24 flex items-center justify-center text-accent-400 font-mono text-lg">Chart coming soon...</div>
            </CardContent>
          </Card>
        </main>
      </div>
    </AppLayout>
  );
}
