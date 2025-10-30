import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, TrendingUp, Users, Activity, Zap, Globe, BookOpen, Palette } from 'lucide-react';
import { useState } from 'react';

// Option 1: Futuristic Neon Fusion (Purple, Cyan, and Black, with geometric grid layout, headings in Orbitron, body in system-ui)
const neonKpis = [
  {
    label: 'Global Reach',
    value: '72 Countries',
    icon: <Globe className="size-7 text-cyan-400" />,
    trend: '+3',
    description: 'new countries this month',
  },
  {
    label: 'Knowledge Base',
    value: '1,204',
    icon: <BookOpen className="size-7 text-purple-400" />,
    trend: '+120',
    description: 'articles published',
  },
  {
    label: 'Design Variants',
    value: '18',
    icon: <Palette className="size-7 text-pink-400" />,
    trend: '+2',
    description: 'new themes',
  },
  {
    label: 'Active Users',
    value: 1287,
    icon: <Users className="size-7 text-cyan-400" />,
    trend: '+4.2%',
    description: 'in the last 24 hours',
  },
];

export function NeonFusionDashboard() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-cyan-900 py-10 px-2 md:px-8 font-sans">
        <header className="mb-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-widest text-cyan-300 font-orbitron drop-shadow-neon mb-2 uppercase transition-colors duration-500">Neon Fusion Dashboard</h1>
          <p className="text-base md:text-lg text-purple-200 font-normal max-w-2xl leading-relaxed">A futuristic dashboard blending neon colors, geometric grid layouts, and Orbitron headings for a cyberpunk-inspired experience.</p>
        </header>
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
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
                  {kpi.icon}
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
        </section>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          <Card className="bg-black/80 border border-cyan-700 shadow-2xl rounded-xl transition-shadow duration-300 hover:shadow-neon">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-orbitron text-cyan-200 font-bold uppercase">Live Activity</CardTitle>
              <CardDescription className="text-purple-200">Real-time updates and micro-interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="bg-cyan-900/40 text-cyan-200 border-cyan-400 hover:bg-cyan-800/60 hover:text-white transition-all duration-300 shadow-md font-orbitron">Trigger Action</Button>
              <div className="mt-6 h-24 flex items-center justify-center text-pink-400 animate-pulse font-orbitron text-lg">Live data coming soon...</div>
            </CardContent>
          </Card>
          <Card className="bg-black/80 border border-cyan-700 shadow-2xl rounded-xl transition-shadow duration-300 hover:shadow-neon">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-orbitron text-cyan-200 font-bold uppercase">Analytics</CardTitle>
              <CardDescription className="text-purple-200">Charts, trends, and more</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-24 flex items-center justify-center text-cyan-400 font-orbitron text-lg">Chart coming soon...</div>
            </CardContent>
          </Card>
          <Card className="bg-black/80 border border-cyan-700 shadow-2xl rounded-xl transition-shadow duration-300 hover:shadow-neon">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-orbitron text-cyan-200 font-bold uppercase">Design Gallery</CardTitle>
              <CardDescription className="text-purple-200">Explore fusion themes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-24 flex items-center justify-center text-pink-400 font-orbitron text-lg">Gallery coming soon...</div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}

// Option 2 and 3 will be created next.
