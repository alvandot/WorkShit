import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, TrendingUp, Users, Activity, Zap } from 'lucide-react';
import { useState } from 'react';

const kpis = [
  {
    label: 'Active Users',
    value: 1287,
    icon: <Users className="size-7 text-cyan-400" />,
    trend: '+4.2%',
    description: 'in the last 24 hours',
  },
  {
    label: 'Engagement',
    value: '87%',
    icon: <Activity className="size-7 text-blue-400" />,
    trend: '+2.1%',
    description: 'vs last week',
  },
  {
    label: 'Performance',
    value: '99.9%',
    icon: <Zap className="size-7 text-cyan-300" />,
    trend: 'stable',
    description: 'system uptime',
  },
  {
    label: 'Growth',
    value: '+312',
    icon: <TrendingUp className="size-7 text-blue-300" />,
    trend: '+8.7%',
    description: 'new signups',
  },
];

export default function DemoDashboard() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-900 py-12 px-4 sm:px-8 font-sans">
        <header className="mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight text-cyan-300 font-inter drop-shadow-lg mb-2 transition-colors duration-500">Professional Dashboard</h1>
          <p className="text-lg text-blue-100 font-normal max-w-2xl leading-relaxed">A modern, interactive dashboard built with React, Tailwind CSS, and shadcn/ui. Experience a dark blue and cyan palette, Inter headings, and micro-interactions throughout.</p>
        </header>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {kpis.map((kpi, idx) => (
            <Card
              key={kpi.label}
              className={`group relative bg-blue-950/80 border-none shadow-xl rounded-2xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl focus-within:ring-2 focus-within:ring-cyan-400 ${hovered === idx ? 'ring-2 ring-cyan-400' : ''}`}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              tabIndex={0}
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-3 rounded-full bg-gradient-to-br from-cyan-700 to-blue-800 shadow-md group-hover:scale-110 transition-transform duration-300">
                  {kpi.icon}
                </div>
                <div>
                  <CardTitle className="text-3xl font-inter text-cyan-200 font-bold tracking-tight mb-1">{kpi.value}</CardTitle>
                  <CardDescription className="text-blue-200 text-sm font-medium">{kpi.label}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <span className="text-cyan-400 font-semibold text-lg">{kpi.trend}</span>
                <span className="text-blue-300 text-xs">{kpi.description}</span>
              </CardContent>
              <div className="absolute inset-0 rounded-2xl pointer-events-none group-hover:bg-cyan-400/5 transition-colors duration-300" />
            </Card>
          ))}
        </section>
        <section className="flex flex-col md:flex-row gap-8 items-stretch">
          <Card className="flex-1 bg-blue-950/80 border-none shadow-xl rounded-2xl transition-shadow duration-300 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-inter text-cyan-200 font-bold">Live Activity</CardTitle>
              <CardDescription className="text-blue-200">Real-time updates and micro-interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="bg-cyan-900/40 text-cyan-200 border-cyan-400 hover:bg-cyan-800/60 hover:text-white transition-all duration-300 shadow-md font-inter">Trigger Action</Button>
              <div className="mt-6 h-32 flex items-center justify-center text-cyan-400 animate-pulse font-inter text-xl">Live data coming soon...</div>
            </CardContent>
          </Card>
          <Card className="flex-1 bg-blue-950/80 border-none shadow-xl rounded-2xl transition-shadow duration-300 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-inter text-cyan-200 font-bold">Analytics</CardTitle>
              <CardDescription className="text-blue-200">Charts, trends, and more</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center text-cyan-400 font-inter text-xl">Chart coming soon...</div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
