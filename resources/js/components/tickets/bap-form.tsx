import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import FileUploadWithPreview from '@/components/file-upload-with-preview';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface ReplacedPart {
    quantity: string;
    description: string;
    part_number: string;
    serial_number: string;
}

interface BapFormData {
    // User Information (from ticket)
    user_name: string;
    user_id_number: string;
    location: string;
    user_phone: string;
    user_email: string;

    // Case Details
    unit_type: string;
    category: string;
    scope: string;
    warranty_status: string;
    case_description: string;

    // Work Information
    work_notes: string;
    solution_category: string;

    // Parts
    replaced_parts: ReplacedPart[];

    // Visit & Resolution
    visit_date: string;
    visit_time: string;
    resolved_date: string;
    resolved_time: string;

    // Files
    ct_bad_part: File[];
    ct_good_part: File[];
    bap_file: File[];

    // Completion notes
    completion_notes: string;
}

interface BapFormProps {
    data: BapFormData;
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    ticket: any;
    onZoomPreview: (url: string, label: string) => void;
}

export default function BapForm({
    data,
    setData,
    errors,
    ticket,
    onZoomPreview,
}: BapFormProps) {
    const addReplacedPart = () => {
        setData('replaced_parts', [
            ...data.replaced_parts,
            { quantity: '1', description: '', part_number: '', serial_number: '' },
        ]);
    };

    const removeReplacedPart = (index: number) => {
        const newParts = data.replaced_parts.filter((_, i) => i !== index);
        setData('replaced_parts', newParts);
    };

    const updateReplacedPart = (index: number, field: string, value: string) => {
        const newParts = [...data.replaced_parts];
        newParts[index] = { ...newParts[index], [field]: value };
        setData('replaced_parts', newParts);
    };

    return (
        <div className="space-y-6">
            {/* Informasi User Section */}
            <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-4 font-semibold text-base">Informasi User</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="user_name">Nama User</Label>
                        <Input
                            id="user_name"
                            value={data.user_name}
                            onChange={(e) => setData('user_name', e.target.value)}
                            placeholder="Nama lengkap user"
                        />
                        {errors.user_name && (
                            <p className="mt-1 text-xs text-destructive">{errors.user_name}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="user_id_number">ID User</Label>
                        <Input
                            id="user_id_number"
                            value={data.user_id_number}
                            onChange={(e) => setData('user_id_number', e.target.value)}
                            placeholder="NIK/ID Karyawan"
                        />
                    </div>

                    <div>
                        <Label htmlFor="user_phone">No. Telp</Label>
                        <Input
                            id="user_phone"
                            value={data.user_phone}
                            onChange={(e) => setData('user_phone', e.target.value)}
                            placeholder="08xxxxxxxxxx"
                        />
                    </div>

                    <div>
                        <Label htmlFor="user_email">Email</Label>
                        <Input
                            id="user_email"
                            type="email"
                            value={data.user_email}
                            onChange={(e) => setData('user_email', e.target.value)}
                            placeholder="user@company.com"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <Label htmlFor="location">Lokasi</Label>
                        <Input
                            id="location"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                            placeholder="Alamat lengkap lokasi"
                        />
                    </div>
                </div>
            </div>

            {/* Case Details Section */}
            <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-4 font-semibold text-base">Case Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="unit_type">Tipe Unit</Label>
                        <Select value={data.unit_type} onValueChange={(val) => setData('unit_type', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih tipe unit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Desktop">Desktop</SelectItem>
                                <SelectItem value="Laptop">Laptop</SelectItem>
                                <SelectItem value="Printer">Printer</SelectItem>
                                <SelectItem value="Projector">Projector</SelectItem>
                                <SelectItem value="Scanner">Scanner</SelectItem>
                                <SelectItem value="Monitor">Monitor</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.unit_type && (
                            <p className="mt-1 text-xs text-destructive">{errors.unit_type}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="category">Kategori</Label>
                        <Select value={data.category} onValueChange={(val) => setData('category', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Incident">Incident</SelectItem>
                                <SelectItem value="Request">Request</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.category && (
                            <p className="mt-1 text-xs text-destructive">{errors.category}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="scope">Scope</Label>
                        <Select value={data.scope} onValueChange={(val) => setData('scope', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih scope" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Maintenance Support">Maintenance Support</SelectItem>
                                <SelectItem value="Void">Void</SelectItem>
                                <SelectItem value="Out of Scope">Out of Scope</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.scope && (
                            <p className="mt-1 text-xs text-destructive">{errors.scope}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="warranty_status">Product Warranty</Label>
                        <Select value={data.warranty_status} onValueChange={(val) => setData('warranty_status', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih warranty status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Warranty">Warranty</SelectItem>
                                <SelectItem value="Out of Warranty">Out of Warranty</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.warranty_status && (
                            <p className="mt-1 text-xs text-destructive">{errors.warranty_status}</p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <Label htmlFor="case_description">Case Description</Label>
                        <Textarea
                            id="case_description"
                            value={data.case_description}
                            onChange={(e) => setData('case_description', e.target.value)}
                            placeholder="Deskripsi detail case/masalah"
                            rows={3}
                        />
                        {errors.case_description && (
                            <p className="mt-1 text-xs text-destructive">{errors.case_description}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Work Information Section */}
            <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-4 font-semibold text-base">Catatan Pekerjaan dan Solusi</h3>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="work_notes">Catatan Pekerjaan</Label>
                        <Textarea
                            id="work_notes"
                            value={data.work_notes}
                            onChange={(e) => setData('work_notes', e.target.value)}
                            placeholder="Jelaskan pekerjaan yang dilakukan dan solusi yang diberikan"
                            rows={4}
                        />
                        {errors.work_notes && (
                            <p className="mt-1 text-xs text-destructive">{errors.work_notes}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="solution_category">Kategori Solusi</Label>
                        <Select value={data.solution_category} onValueChange={(val) => setData('solution_category', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori solusi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Repair">Repair</SelectItem>
                                <SelectItem value="Re/Install">Re/Install</SelectItem>
                                <SelectItem value="Reimage">Reimage</SelectItem>
                                <SelectItem value="Pemindahan Data">Pemindahan Data</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.solution_category && (
                            <p className="mt-1 text-xs text-destructive">{errors.solution_category}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Replaced Parts Section */}
            <div className="rounded-lg border bg-card p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-base">Replaced Parts (Optional)</h3>
                    <Button type="button" size="sm" variant="outline" onClick={addReplacedPart}>
                        <Plus className="mr-1 size-4" />
                        Add Part
                    </Button>
                </div>

                {data.replaced_parts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No parts replaced. Click "Add Part" if components were replaced.</p>
                ) : (
                    <div className="space-y-4">
                        {data.replaced_parts.map((part, index) => (
                            <div key={index} className="relative rounded-md border bg-background p-4">
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="absolute right-2 top-2 size-8 text-destructive hover:bg-destructive/10"
                                    onClick={() => removeReplacedPart(index)}
                                >
                                    <Trash2 className="size-4" />
                                </Button>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pr-10">
                                    <div>
                                        <Label htmlFor={`qty-${index}`} className="text-xs">Quantity</Label>
                                        <Input
                                            id={`qty-${index}`}
                                            type="number"
                                            min="1"
                                            value={part.quantity}
                                            onChange={(e) => updateReplacedPart(index, 'quantity', e.target.value)}
                                            placeholder="1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`desc-${index}`} className="text-xs">Deskripsi Part</Label>
                                        <Input
                                            id={`desc-${index}`}
                                            value={part.description}
                                            onChange={(e) => updateReplacedPart(index, 'description', e.target.value)}
                                            placeholder="Top Cover"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`pn-${index}`} className="text-xs">Part Number</Label>
                                        <Input
                                            id={`pn-${index}`}
                                            value={part.part_number}
                                            onChange={(e) => updateReplacedPart(index, 'part_number', e.target.value)}
                                            placeholder="N16777-001"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`sn-${index}`} className="text-xs">Serial Number</Label>
                                        <Input
                                            id={`sn-${index}`}
                                            value={part.serial_number}
                                            onChange={(e) => updateReplacedPart(index, 'serial_number', e.target.value)}
                                            placeholder="BKJBG3A5WKBNO"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Visit & Resolution Time Section */}
            <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-4 font-semibold text-base">Waktu Visit & Resolved</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="visit_date">Tanggal Visit</Label>
                        <Input
                            id="visit_date"
                            type="date"
                            value={data.visit_date}
                            onChange={(e) => setData('visit_date', e.target.value)}
                        />
                        {errors.visit_date && (
                            <p className="mt-1 text-xs text-destructive">{errors.visit_date}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="visit_time">Jam Visit</Label>
                        <Input
                            id="visit_time"
                            type="time"
                            value={data.visit_time}
                            onChange={(e) => setData('visit_time', e.target.value)}
                        />
                        {errors.visit_time && (
                            <p className="mt-1 text-xs text-destructive">{errors.visit_time}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="resolved_date">Tanggal Resolved</Label>
                        <Input
                            id="resolved_date"
                            type="date"
                            value={data.resolved_date}
                            onChange={(e) => setData('resolved_date', e.target.value)}
                        />
                        {errors.resolved_date && (
                            <p className="mt-1 text-xs text-destructive">{errors.resolved_date}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="resolved_time">Jam Resolved</Label>
                        <Input
                            id="resolved_time"
                            type="time"
                            value={data.resolved_time}
                            onChange={(e) => setData('resolved_time', e.target.value)}
                        />
                        {errors.resolved_time && (
                            <p className="mt-1 text-xs text-destructive">{errors.resolved_time}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* File Uploads Section */}
            <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-4 font-semibold text-base">Upload Dokumen</h3>
                <div className="space-y-4">
                    <FileUploadWithPreview
                        label="CT Bad Part"
                        name="ct_bad_part"
                        accept="image/*"
                        maxSize={10}
                        multiple={true}
                        value={data.ct_bad_part}
                        onChange={(files) => setData('ct_bad_part', files)}
                        error={errors.ct_bad_part}
                        description="Upload foto komponen yang rusak (akan dikonversi ke WebP)"
                        existingFiles={ticket.ct_bad_part || []}
                        required={true}
                    />

                    <FileUploadWithPreview
                        label="CT Good Part"
                        name="ct_good_part"
                        accept="image/*"
                        maxSize={10}
                        multiple={true}
                        value={data.ct_good_part}
                        onChange={(files) => setData('ct_good_part', files)}
                        error={errors.ct_good_part}
                        description="Upload foto komponen pengganti (akan dikonversi ke WebP)"
                        existingFiles={ticket.ct_good_part || []}
                        required={true}
                    />

                    <FileUploadWithPreview
                        label="BAP (Berita Acara Pekerjaan)"
                        name="bap_file"
                        accept="image/*"
                        maxSize={20}
                        multiple={false}
                        value={data.bap_file}
                        onChange={(files) => setData('bap_file', files)}
                        error={errors.bap_file}
                        description="Upload BAP yang sudah ditandatangani (format original)"
                        existingFiles={ticket.bap_file || []}
                        disableWebpConversion={true}
                        required={true}
                    />
                </div>
            </div>

            {/* Preview Section */}
            {(data.ct_bad_part.length > 0 || data.ct_good_part.length > 0 || data.bap_file.length > 0) && (
                <div className="rounded-lg border bg-card p-4">
                    <h3 className="mb-3 font-semibold text-base">Preview File</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {data.ct_bad_part.map((file: File, idx: number) => {
                            const url = URL.createObjectURL(file);
                            return (
                                <div key={file.name + idx} className="relative group border rounded-lg overflow-hidden">
                                    <img
                                        src={url}
                                        alt={file.name}
                                        className="object-cover w-full h-32 cursor-zoom-in"
                                        onClick={() => onZoomPreview(url, 'CT Bad Part')}
                                    />
                                    <span className="absolute top-1 left-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                                        CT Bad
                                    </span>
                                </div>
                            );
                        })}
                        {data.ct_good_part.map((file: File, idx: number) => {
                            const url = URL.createObjectURL(file);
                            return (
                                <div key={file.name + idx} className="relative group border rounded-lg overflow-hidden">
                                    <img
                                        src={url}
                                        alt={file.name}
                                        className="object-cover w-full h-32 cursor-zoom-in"
                                        onClick={() => onZoomPreview(url, 'CT Good Part')}
                                    />
                                    <span className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                                        CT Good
                                    </span>
                                </div>
                            );
                        })}
                        {data.bap_file.map((file: File, idx: number) => {
                            const url = URL.createObjectURL(file);
                            return (
                                <div key={file.name + idx} className="relative group border rounded-lg overflow-hidden">
                                    <img
                                        src={url}
                                        alt={file.name}
                                        className="object-cover w-full h-32 cursor-zoom-in"
                                        onClick={() => onZoomPreview(url, 'BAP File')}
                                    />
                                    <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                                        BAP
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Completion Notes Section */}
            <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-4 font-semibold text-base">Catatan Tambahan</h3>
                <div>
                    <Label htmlFor="completion_notes">Completion Notes (Optional)</Label>
                    <Textarea
                        id="completion_notes"
                        value={data.completion_notes}
                        onChange={(e) => setData('completion_notes', e.target.value)}
                        placeholder="Catatan tambahan untuk completion (opsional)"
                        rows={3}
                    />
                </div>
            </div>
        </div>
    );
}
