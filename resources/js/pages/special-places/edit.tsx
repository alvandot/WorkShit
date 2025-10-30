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
import specialPlacesRoutes from '@/routes/special-places';
import engineersRoutes from '@/routes/engineers';
import { dashboard } from '@/routes';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, ClipboardEdit, MapPin, Sparkles, Trash2 } from 'lucide-react';
import { type FormEvent } from 'react';

interface ProvinceOption {
    id: number;
    name: string;
    code: string;
}

interface EngineerOption {
    id: number;
    name: string;
}

interface SpecialPlaceResource {
    id: number;
    name: string;
    province_id: number;
    province?: {
        id: number;
        name: string;
        code: string;
    } | null;
    engineer_id: number | null;
    engineer?: {
        id: number;
        name: string;
        phone?: string | null;
        email?: string | null;
    } | null;
    city: string | null;
    address: string | null;
    contact_person: string | null;
    contact_phone: string | null;
    is_active: boolean;
    notes: string | null;
}

interface FormData {
    name: string;
    province_id: number | null;
    engineer_id: number | null;
    city: string;
    address: string;
    contact_person: string;
    contact_phone: string;
    is_active: boolean;
    notes: string;
}

interface Props {
    specialPlace: SpecialPlaceResource;
    provinces: ProvinceOption[];
    engineers: EngineerOption[];
}

const breadcrumbs = (specialPlace: SpecialPlaceResource): BreadcrumbItem[] => [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Special Places', href: specialPlacesRoutes.index.url() },
    { title: specialPlace.name, href: specialPlacesRoutes.edit.url({ special_place: specialPlace.id }) },
];

export default function SpecialPlaceEdit({ specialPlace, provinces, engineers }: Props) {
    const { data, setData, put, processing, errors } = useForm<FormData>({
        name: specialPlace.name,
        province_id: specialPlace.province_id,
        engineer_id: specialPlace.engineer_id,
        city: specialPlace.city ?? '',
        address: specialPlace.address ?? '',
        contact_person: specialPlace.contact_person ?? '',
        contact_phone: specialPlace.contact_phone ?? '',
        is_active: specialPlace.is_active,
        notes: specialPlace.notes ?? '',
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(specialPlacesRoutes.update.url({ special_place: specialPlace.id }));
    };

    const handleDelete = () => {
        if (confirm(`Remove ${specialPlace.name} from Special Places?`)) {
            router.delete(specialPlacesRoutes.destroy.url({ special_place: specialPlace.id }));
        }
    };

    const provinceValue = data.province_id ? String(data.province_id) : '';
    const engineerValue = data.engineer_id ? String(data.engineer_id) : '';
    const selectedProvince = provinces.find((province) => province.id === data.province_id);
    const selectedEngineer = engineers.find((engineer) => engineer.id === data.engineer_id);

    return (
        <AppLayout breadcrumbs={breadcrumbs(specialPlace)}>
            <Head title={`Edit ${specialPlace.name}`} />

            <div className="space-y-6 pb-10">
                <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-lg starting:translate-y-4 starting:opacity-0">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_theme(colors.primary/12),_transparent_70%)]" />
                    <div className="flex flex-wrap items-start justify-between gap-6">
                        <div className="space-y-4">
                            <Badge variant="outline" className="w-fit rounded-full border-white/30 bg-white/20 text-xs font-semibold uppercase tracking-[0.35em] text-white dark:text-foreground">
                                Special Place Record
                            </Badge>
                            <h1 className="text-3xl font-bold sm:text-4xl">Update Special Place</h1>
                            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                                Keep location, contact, and assignment details aligned so field teams have the latest context.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Link href={specialPlacesRoutes.index.url()}>
                                <Button variant="ghost" className="rounded-full border border-white/40 bg-white/20 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/40">
                                    <ArrowLeft className="mr-2 size-4" />
                                    Back to list
                                </Button>
                            </Link>
                            <Button type="button" variant="destructive" className="rounded-full" onClick={handleDelete} disabled={processing}>
                                <Trash2 className="mr-2 size-4" />
                                Delete
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-3 md:grid-cols-3">
                        {[
                            {
                                title: 'Profile',
                                description: 'Refresh location and onsite contact details.',
                                icon: ClipboardEdit,
                            },
                            {
                                title: 'Coverage',
                                description: selectedEngineer ? `Assigned to ${selectedEngineer.name}` : 'No engineer assigned yet.',
                                icon: MapPin,
                            },
                            {
                                title: 'Status',
                                description: specialPlace.is_active ? 'Currently active' : 'Inactive location',
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
                                            Focus
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
                                <CardTitle>Location Profile</CardTitle>
                                <CardDescription>Keep details current so every visit starts smoothly.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Location name *</Label>
                                    <Input id="name" value={data.name} onChange={(event) => setData('name', event.target.value)} required />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" value={data.city} onChange={(event) => setData('city', event.target.value)} />
                                    <InputError message={errors.city} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="province_id">Province *</Label>
                                    <Select value={provinceValue} onValueChange={(value) => setData('province_id', value === '' ? null : Number(value))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select province" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Select province</SelectItem>
                                            {provinces.map((province) => (
                                                <SelectItem key={province.id} value={String(province.id)}>
                                                    {province.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.province_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="engineer_id">Assigned engineer</Label>
                                    <Select value={engineerValue} onValueChange={(value) => setData('engineer_id', value === '' ? null : Number(value))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select engineer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">No engineer yet</SelectItem>
                                            {engineers.map((engineer) => (
                                                <SelectItem key={engineer.id} value={String(engineer.id)}>
                                                    {engineer.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.engineer_id} />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Textarea id="address" value={data.address} onChange={(event) => setData('address', event.target.value)} />
                                    <InputError message={errors.address} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contact_person">Contact person</Label>
                                    <Input id="contact_person" value={data.contact_person} onChange={(event) => setData('contact_person', event.target.value)} />
                                    <InputError message={errors.contact_person} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contact_phone">Contact phone</Label>
                                    <Input id="contact_phone" value={data.contact_phone} onChange={(event) => setData('contact_phone', event.target.value)} />
                                    <InputError message={errors.contact_phone} />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea id="notes" value={data.notes} onChange={(event) => setData('notes', event.target.value)} placeholder="Update key instructions, security details, or escalation paths." />
                                    <InputError message={errors.notes} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-border/60">
                            <CardHeader>
                                <CardTitle>Activation & Summary</CardTitle>
                                <CardDescription>Ensure the latest snapshot before saving changes.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4">
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">Active monitoring</p>
                                        <p className="text-xs text-muted-foreground">Inactive locations are hidden from active dashboards.</p>
                                    </div>
                                    <Switch checked={data.is_active} onCheckedChange={(value) => setData('is_active', value)} />
                                </div>

                                <div className="grid gap-3 text-sm">
                                    <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
                                        <span className="text-muted-foreground">Location</span>
                                        <span className="font-semibold text-foreground">{data.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
                                        <span className="text-muted-foreground">Province</span>
                                        <span className="font-semibold text-foreground">{selectedProvince?.name ?? 'Not selected'}</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
                                        <span className="text-muted-foreground">Engineer</span>
                                        <span className="font-semibold text-foreground">{selectedEngineer?.name ?? 'Unassigned'}</span>
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
                                        {processing ? 'Saving...' : 'Save changes'}
                                    </Button>
                                    <Link href={specialPlacesRoutes.index.url()}>
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
                                <CardTitle>Assigned Engineer Snapshot</CardTitle>
                                <CardDescription>Quick view of the engineer responsible for this site.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                {selectedEngineer ? (
                                    <>
                                        <p className="font-semibold text-foreground">{selectedEngineer.name}</p>
                                        <p className="text-muted-foreground">Reach out via engineer directory for more context or schedule coordination.</p>
                                        <Link href={engineersRoutes.edit.url({ engineer: selectedEngineer.id })} className="text-primary hover:underline">
                                            View engineer profile
                                        </Link>
                                    </>
                                ) : (
                                    <p className="text-muted-foreground">No engineer assigned yet. Assign one to streamline on-site coordination.</p>
                                )}
                            </CardContent>
                        </Card>
                    </aside>
                </form>
            </div>
        </AppLayout>
    );
}
