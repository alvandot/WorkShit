import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Globe, BookOpen, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';

// Combined Fusion Dashboard: Each section uses a different fusion style
export default function CombinedFusionDashboard() {
  const [hovered, setHovered] = useState<number | null>(null);
  type Kpi = {
    label: string;
    value: string | number;
    icon: 'Users' | 'Globe' | 'BookOpen' | 'Palette';
    trend: string;
    description: string;
  };
  type KpiData = {
    neonFusion: Kpi[];
    editorialGrid: Kpi[];
    minimalistSplit: Kpi[];
  };
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map icon name to Lucide icon component with color class
  const iconMap: Record<Kpi['icon'], React.FC<{ className: string }>> = {
    Users,
    Globe,
    BookOpen,
    Palette,
  };

  function renderIcon(icon: Kpi['icon'], className: string) {
    const Icon = iconMap[icon];
    return Icon ? <Icon className={className} /> : null;
  }

  // Color classes for each section
  const neonColors = ['text-cyan-400', 'text-purple-400', 'text-pink-400', 'text-cyan-400'];
  const editorialColors = ['text-olive-700', 'text-ochre-600', 'text-olive-500', 'text-ochre-400'];
  const editorialColors2 = ['text-ochre-700', 'text-olive-700', 'text-ochre-800', 'text-olive-800'];
  const splitColors = ['text-slate-600', 'text-accent-500', 'text-slate-400', 'text-accent-400'];

  useEffect(() => {
    fetch('/api/dashboard/kpis', {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin',
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch KPIs');
        const data = await res.json();
        setKpis(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Unknown error');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-2xl text-cyan-400 font-orbitron">Loading dashboard KPIs...</div>
        </div>
      </AppLayout>
    );
  }
  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-red-500 text-lg font-bold">{error}</div>
        </div>
      </AppLayout>
    );
  }

  // Defensive: if kpis is null or missing keys
  const neonKpis: Kpi[] = kpis?.neonFusion ?? [];
  const editorialKpis: Kpi[] = kpis?.editorialGrid ?? [];
  const splitKpis: Kpi[] = kpis?.minimalistSplit ?? [];

  return (
    <AppLayout>
      {/* Neon Fusion Section */}
      <section className="min-h-[60vh] bg-gradient-to-br from-black via-blue-950 to-cyan-900 py-10 px-2 md:px-8 font-sans">
        <header className="mb-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-widest text-cyan-300 font-orbitron drop-shadow-neon mb-2 uppercase transition-colors duration-500">Neon Fusion</h1>
          <p className="text-base md:text-lg text-purple-200 font-normal max-w-2xl leading-relaxed">A cyberpunk-inspired section with neon colors, geometric grid, and Orbitron headings.</p>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {neonKpis.map((kpi, idx) => (
            <Card
              key={kpi.label}
              className={`group relative bg-black/80 border border-cyan-700 shadow-2xl rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-neon focus-within:ring-2 focus-within:ring-pink-400 ${hovered === idx ? 'ring-2 ring-cyan-400' : ''}`}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              tabIndex={0}
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-3 rounded-full bg-gradient-to-br from-cyan-700 to-purple-800 shadow-md group-hover:scale-110 transition-transform duration-300">
                  {renderIcon(kpi.icon, `size-7 ${neonColors[idx % neonColors.length]}`)}
                </div>
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-orbitron text-cyan-200 font-bold tracking-widest mb-1 uppercase">{kpi.value}</CardTitle>
                  <CardDescription className="text-purple-200 text-xs md:text-sm font-medium uppercase tracking-wide">{kpi.label}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <span className="text-pink-400 font-semibold text-lg">{kpi.trend}</span>
                <span className="text-cyan-300 text-xs">{kpi.description}</span>
              </CardContent>
              <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:bg-cyan-400/10 transition-colors duration-300" />
            </Card>
          ))}
        </div>
      </section>
      {/* Editorial Grid Section */}
      <section className="min-h-[60vh] bg-gradient-to-br from-ochre-50 via-olive-50 to-ochre-100 py-10 px-2 md:px-8 font-serif">
        <header className="mb-8 pl-2 md:pl-8">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-ochre-700 font-serif mb-2 transition-colors duration-500">Editorial Grid</h2>
          <p className="text-base md:text-lg text-olive-700 font-normal max-w-2xl leading-relaxed">Editorial-inspired, asymmetric grid, warm ochre and olive palette, serif headings.</p>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 md:col-span-3 flex flex-col gap-8">
            {editorialKpis.slice(0,2).map((kpi, idx) => (
              <Card
                key={kpi.label}
                className={`group relative bg-ochre-50 border border-olive-200 shadow-lg rounded-xl transition-transform duration-300 hover:scale-102 hover:shadow-xl focus-within:ring-2 focus-within:ring-ochre-400 ${hovered === idx ? 'ring-2 ring-olive-400' : ''}`}
                onMouseEnter={() => setHovered(idx+10)}
                onMouseLeave={() => setHovered(null)}
                tabIndex={0}
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="p-3 rounded-full bg-gradient-to-br from-olive-100 to-ochre-100 shadow-md group-hover:scale-110 transition-transform duration-300">
                    {renderIcon(kpi.icon, `size-7 ${editorialColors[idx % editorialColors.length]}`)}
                  </div>
                  <div>
                    <CardTitle className="text-2xl md:text-3xl font-serif text-olive-800 font-bold tracking-tight mb-1">{kpi.value}</CardTitle>
                    <CardDescription className="text-ochre-700 text-xs md:text-sm font-medium">{kpi.label}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <span className="text-ochre-600 font-semibold text-lg">{kpi.trend}</span>
                  <span className="text-olive-700 text-xs">{kpi.description}</span>
                </CardContent>
                <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:bg-olive-200/10 transition-colors duration-300" />
              </Card>
            ))}
          </div>
          <div className="col-span-2 flex flex-col gap-8">
            {editorialKpis.slice(2).map((kpi, idx) => (
              <Card
                key={kpi.label}
                className={`group relative bg-olive-50 border border-ochre-200 shadow-lg rounded-xl transition-transform duration-300 hover:scale-102 hover:shadow-xl focus-within:ring-2 focus-within:ring-olive-400 ${hovered === idx+12 ? 'ring-2 ring-ochre-400' : ''}`}
                onMouseEnter={() => setHovered(idx+12)}
                onMouseLeave={() => setHovered(null)}
                tabIndex={0}
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="p-3 rounded-full bg-gradient-to-br from-ochre-100 to-olive-100 shadow-md group-hover:scale-110 transition-transform duration-300">
                    {renderIcon(kpi.icon, `size-7 ${editorialColors2[idx % editorialColors2.length]}`)}
                  </div>
                  <div>
                    <CardTitle className="text-2xl md:text-3xl font-serif text-ochre-800 font-bold tracking-tight mb-1">{kpi.value}</CardTitle>
                    <CardDescription className="text-olive-700 text-xs md:text-sm font-medium">{kpi.label}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <span className="text-olive-600 font-semibold text-lg">{kpi.trend}</span>
                  <span className="text-ochre-700 text-xs">{kpi.description}</span>
                </CardContent>
                <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:bg-ochre-200/10 transition-colors duration-300" />
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Minimalist Split Section */}
      <section className="min-h-[60vh] flex flex-col md:flex-row bg-slate-50 font-mono">
        <aside className="md:w-1/3 bg-slate-900 text-white flex flex-col justify-between py-12 px-6 md:px-10 shadow-2xl">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-accent-400">Minimalist Split</h2>
            <p className="text-base md:text-lg text-slate-200 font-normal max-w-md leading-relaxed mb-8">A strong left-right split, slate and white contrast, mono body for a clean, modern, focused look.</p>
            <div className="space-y-6">
              {splitKpis.map((kpi, idx) => (
                <Card
                  key={kpi.label}
                  className={`group relative bg-slate-800/80 border-none shadow-lg rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl focus-within:ring-2 focus-within:ring-accent-400 ${hovered === idx+20 ? 'ring-2 ring-accent-400' : ''}`}
                  onMouseEnter={() => setHovered(idx+20)}
                  onMouseLeave={() => setHovered(null)}
                  tabIndex={0}
                >
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="p-3 rounded-full bg-gradient-to-br from-accent-400 to-slate-700 shadow-md group-hover:scale-110 transition-transform duration-300">
                      {renderIcon(kpi.icon, `size-7 ${splitColors[idx % splitColors.length]}`)}
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
      </section>
    </AppLayout>
  );
}
