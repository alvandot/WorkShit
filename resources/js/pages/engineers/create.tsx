import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import engineersRoutes from '@/routes/engineers';
import { dashboard } from '@/routes';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ClipboardList, Sparkles, UserCheck } from 'lucide-react';
import { type FormEvent } from 'react';

interface Province {
    id: number;
    name: string;
    code: string;
}

interface FormData {
    employee_code: string;
    name: string;
    email: string;
    phone: string;
    specialization: string;
    experience_years: string;
    primary_province_id: number | null;
    hired_at: string;
    is_active: boolean;
    notes: string;
}

interface Props {
    provinces: Province[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Engineers', href: engineersRoutes.index.url() },
    { title: 'Create', href: engineersRoutes.create.url() },
];

export default function EngineerCreate({ provinces }: Props) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        employee_code: '',
        name: '',
        email: '',
        phone: '',
        specialization: '',
        experience_years: '',
        primary_province_id: null,
        hired_at: '',
        is_active: true,
        notes: '',
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(engineersRoutes.store.url());
    };

    const provinceValue = data.primary_province_id ? String(data.primary_province_id) : '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Engineer" />

            <div className="space-y-6 pb-10">
                <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-lg starting:translate-y-4 starting:opacity-0">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_theme(colors.primary/12),_transparent_65%)]" />
                    <div className="flex flex-wrap items-start justify-between gap-6">
                        <div className="space-y-4">
                            <Badge variant="outline" className="w-fit rounded-full border-white/30 bg-white/20 text-xs font-semibold uppercase tracking-[0.35em] text-white dark:text-foreground">
                                Engineer Onboarding
                            </Badge>
                            <h1 className="text-3xl font-bold sm:text-4xl">Register a New Engineer</h1>
                            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                                Capture profile details, assign a primary province, and set the engineer&apos;s availability for special place dispatching.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href={engineersRoutes.index.url()}>
                                <Button variant="ghost" className="rounded-full border border-white/40 bg-white/20 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/40">
                                    <ArrowLeft className="mr-2 size-4" />
                                    Back to list
                                </Button>
                            </Link>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-xs text-white backdrop-blur dark:text-foreground">
                                <Sparkles className="size-4" />
                                Guided form
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-3 md:grid-cols-3">
                        {[
                            {
                                title: 'Identity',
                                description: 'Basic profile and contact information.',
                                icon: ClipboardList,
                            },
                            {
                                title: 'Coverage',
                                description: 'Assign a primary province to streamline dispatch.',
                                icon: UserCheck,
                            },
                            {
                                title: 'Availability',
                                description: 'Toggle if the engineer is ready for field work.',
                                icon: Sparkles,
                            },
                        ].map((item) => (
                            <div key={item.title} className="rounded-2xl border border-white/20 bg-background/70 p-4 shadow-sm backdrop-blur">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-11 items-center justify-center rounded-full border border-white/30 bg-white/15">
                                        <item.icon className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                                            Step
                                        </p>
                                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                                    </div>
                                </div>
                                <p className="mt-3 text-xs text-muted-foreground">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                    <div className="space-y-6">
                        <Card className="border border-border/60">
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    Keep engineer information complete to coordinate quickly with field teams.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(event) => setData('name', event.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="employee_code">Employee code</Label>
                                    <Input
                                        id="employee_code"
                                        value={data.employee_code}
                                        onChange={(event) => setData('employee_code', event.target.value)}
                                        placeholder="ENG-001"
                                    />
                                    <InputError message={errors.employee_code} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(event) => setData('email', event.target.value)}
                                        placeholder="name@appdesk.test"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(event) => setData('phone', event.target.value)}
                                        placeholder="+62 812-3456-7890"
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="specialization">Specialization</Label>
                                    <Input
                                        id="specialization"
                                        value={data.specialization}
                                        onChange={(event) => setData('specialization', event.target.value)}
                                        placeholder="Networking, HVAC, etc."
                                    />
                                    <InputError message={errors.specialization} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="experience_years">Years of experience</Label>
                                    <Input
                                        id="experience_years"
                                        type="number"
                                        min={0}
                                        max={60}
                                        value={data.experience_years}
                                        onChange={(event) => setData('experience_years', event.target.value)}
                                    />
                                    <InputError message={errors.experience_years} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hired_at">Hired date</Label>
                                    <Input
                                        id="hired_at"
                                        type="date"
                                        value={data.hired_at}
                                        onChange={(event) => setData('hired_at', event.target.value)}
                                    />
                                    <InputError message={errors.hired_at} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="primary_province_id">Primary province</Label>
                                    <Select
                                        value={provinceValue}
                                        onValueChange={(value) => setData('primary_province_id', value === '' ? null : Number(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select province" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">No primary province</SelectItem>
                                            {provinces.map((province) => (
                                                <SelectItem key={province.id} value={String(province.id)}>
                                                    {province.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.primary_province_id} />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(event) => setData('notes', event.target.value)}
                                        placeholder="Add additional context such as preferred shift, certifications, or emergency contacts."
                                    />
                                    <InputError message={errors.notes} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-border/60">
                            <CardHeader>
                                <CardTitle>Availability</CardTitle>
                                <CardDescription>
                                    Toggle engineer readiness and share onboarding summary before saving.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4">
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">Active for assignments</p>
                                        <p className="text-xs text-muted-foreground">
                                            Inactive engineers will be hidden from Special Place assignment lists.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.is_active}
                                        onCheckedChange={(value) => setData('is_active', value)}
                                    />
                                </div>

                                <div className="grid gap-3 text-sm">
                                    <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
                                        <span className="text-muted-foreground">Engineer name</span>
                                        <span className="font-semibold text-foreground">{data.name || '—'}</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
                                        <span className="text-muted-foreground">Primary province</span>
                                        <span className="font-semibold text-foreground">
                                            {provinces.find((province) => province.id === data.primary_province_id)?.name ?? 'Unassigned'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
                                        <span className="text-muted-foreground">Status</span>
                                        <span className={cn('inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold', data.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200' : 'bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200')}>
                                            {data.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4">
                                    <Button type="submit" disabled={processing} className="min-w-36 rounded-full">
                                        {processing ? 'Saving...' : 'Save engineer'}
                                    </Button>
                                    <Link href={engineersRoutes.index.url()}>
                                        <Button type="button" variant="outline" className="rounded-full" disabled={processing}>
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <aside className="space-y-6">
                        <Card className="sticky top-28 border border-border/60">
                            <CardHeader>
                                <CardTitle>Quick Tips</CardTitle>
                                <CardDescription>
                                    Ensure the engineer profile is as complete as possible for smoother scheduling.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <p>• Employee code helps cross-reference with HRIS records.</p>
                                <p>• Select the primary province to surface the engineer in Special Place forms.</p>
                                <p>• Use notes to capture certifications, languages, or access cards.</p>
                            </CardContent>
                        </Card>
                    </aside>
                </form>
            </div>
        </AppLayout>
    );
}
