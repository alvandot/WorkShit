import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Globe, BookOpen, Palette } from 'lucide-react';
import { useState } from 'react';

// Option 2: Editorial Grid (Warm ochre, olive, and off-white, with serif headings, body in system-ui, asymmetric grid, editorial whitespace)
const editorialKpis = [
  {
    label: 'Writers',
    value: 42,
    icon: <Users className="size-7 text-olive-700" />,
    trend: '+3',
    description: 'joined this month',
  },
  {
    label: 'Articles',
    value: '1,204',
    icon: <BookOpen className="size-7 text-ochre-600" />,
    trend: '+120',
    description: 'published',
  },
  {
    label: 'Regions',
    value: '18',
    icon: <Globe className="size-7 text-olive-500" />,
    trend: '+2',
    description: 'new regions',
  },
  {
    label: 'Themes',
    value: '7',
    icon: <Palette className="size-7 text-ochre-400" />,
    trend: '+1',
    description: 'added',
  },
];

export function EditorialGridDashboard() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-ochre-50 via-olive-50 to-ochre-100 py-10 px-2 md:px-8 font-serif">
        <header className="mb-8 pl-2 md:pl-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-ochre-700 font-serif mb-2 transition-colors duration-500">Editorial Grid Dashboard</h1>
          <p className="text-base md:text-lg text-olive-700 font-normal max-w-2xl leading-relaxed">A dashboard inspired by editorial design, with asymmetric grid, warm ochre and olive palette, and serif headings for a refined, print-like feel.</p>
        </header>
        <section className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 md:col-span-3 flex flex-col gap-8">
            {editorialKpis.slice(0,2).map((kpi, idx) => (
              <Card
                key={kpi.label}
                className={`group relative bg-ochre-50 border border-olive-200 shadow-lg rounded-xl transition-transform duration-300 hover:scale-102 hover:shadow-xl focus-within:ring-2 focus-within:ring-ochre-400 ${hovered === idx ? 'ring-2 ring-olive-400' : ''}`}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                tabIndex={0}
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="p-3 rounded-full bg-gradient-to-br from-olive-100 to-ochre-100 shadow-md group-hover:scale-110 transition-transform duration-300">
                    {kpi.icon}
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
                className={`group relative bg-olive-50 border border-ochre-200 shadow-lg rounded-xl transition-transform duration-300 hover:scale-102 hover:shadow-xl focus-within:ring-2 focus-within:ring-olive-400 ${hovered === idx ? 'ring-2 ring-ochre-400' : ''}`}
                onMouseEnter={() => setHovered(idx+2)}
                onMouseLeave={() => setHovered(null)}
                tabIndex={0}
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="p-3 rounded-full bg-gradient-to-br from-ochre-100 to-olive-100 shadow-md group-hover:scale-110 transition-transform duration-300">
                    {kpi.icon}
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
        </section>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          <Card className="bg-ochre-50 border border-olive-200 shadow-lg rounded-xl transition-shadow duration-300 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-serif text-olive-800 font-bold">Editorial Activity</CardTitle>
              <CardDescription className="text-ochre-700">Recent editorial actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="bg-olive-100 text-olive-800 border-ochre-400 hover:bg-ochre-200 hover:text-ochre-900 transition-all duration-300 shadow-md font-serif">Trigger Editorial Action</Button>
              <div className="mt-6 h-24 flex items-center justify-center text-ochre-600 animate-pulse font-serif text-lg">Editorial data coming soon...</div>
            </CardContent>
          </Card>
          <Card className="bg-olive-50 border border-ochre-200 shadow-lg rounded-xl transition-shadow duration-300 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-serif text-ochre-800 font-bold">Regional Analytics</CardTitle>
              <CardDescription className="text-olive-700">Regional trends and more</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-24 flex items-center justify-center text-olive-600 font-serif text-lg">Chart coming soon...</div>
            </CardContent>
          </Card>
          <Card className="bg-ochre-50 border border-olive-200 shadow-lg rounded-xl transition-shadow duration-300 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-serif text-olive-800 font-bold">Theme Gallery</CardTitle>
              <CardDescription className="text-ochre-700">Explore editorial themes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-24 flex items-center justify-center text-ochre-600 font-serif text-lg">Gallery coming soon...</div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}

// Option 3 will be created next.
