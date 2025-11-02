import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FileUploadWithPreview from '@/components/file-upload-with-preview';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState, useMemo } from 'react';

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
    setData: (key: string, value: unknown) => void;
    errors: Record<string, string>;
    ticket: {
        ct_bad_part?: string[];
        ct_good_part?: string[];
        bap_file?: string[];
        [key: string]: unknown;
    };
}

export default function BapForm({
    data,
    setData,
    errors,
    ticket,
}: BapFormProps) {
    const [zoomedImage, setZoomedImage] = useState<{ url: string; name: string } | null>(null);

    // Check if all required files are uploaded
    const isCtBadPartUploaded = data.ct_bad_part.length > 0;
    const isCtGoodPartUploaded = data.ct_good_part.length > 0;
    const isBapFileUploaded = data.bap_file.length > 0;
    const allFilesUploaded = isCtBadPartUploaded && isCtGoodPartUploaded && isBapFileUploaded;

    return (
        <div className="space-y-6">{/* File Upload Verification Alert */}
            {!allFilesUploaded && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 size-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                        <div className="flex-1">
                            <h4 className="font-semibold text-sm text-red-800 dark:text-red-200">
                                File yang Wajib Diupload
                            </h4>
                            <ul className="mt-2 space-y-1 text-sm text-red-700 dark:text-red-300">
                                <li className="flex items-center gap-2">
                                    {isCtBadPartUploaded ? (
                                        <CheckCircle2 className="size-4 text-green-600" />
                                    ) : (
                                        <AlertCircle className="size-4" />
                                    )}
                                    <span className={isCtBadPartUploaded ? 'line-through opacity-60' : ''}>
                                        CT Bad Part - Foto komponen yang rusak
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    {isCtGoodPartUploaded ? (
                                        <CheckCircle2 className="size-4 text-green-600" />
                                    ) : (
                                        <AlertCircle className="size-4" />
                                    )}
                                    <span className={isCtGoodPartUploaded ? 'line-through opacity-60' : ''}>
                                        CT Good Part - Foto komponen pengganti
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    {isBapFileUploaded ? (
                                        <CheckCircle2 className="size-4 text-green-600" />
                                    ) : (
                                        <AlertCircle className="size-4" />
                                    )}
                                    <span className={isBapFileUploaded ? 'line-through opacity-60' : ''}>
                                        BAP File - Berita acara yang ditandatangani
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Alert */}
            {allFilesUploaded && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="size-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                        <div className="flex-1">
                            <h4 className="font-semibold text-sm text-green-800 dark:text-green-200">
                                Semua file wajib sudah diupload!
                            </h4>
                            <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                                {data.ct_bad_part.length + data.ct_good_part.length + data.bap_file.length} file siap untuk disubmit.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Zoomed Image Lightbox */}
            {zoomedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setZoomedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
                        onClick={() => setZoomedImage(null)}
                    >
                        <X className="size-6" />
                    </button>
                    <div className="relative max-h-[90vh] max-w-[90vw]">
                        <img
                            src={zoomedImage.url}
                            alt={zoomedImage.name}
                            className="max-h-[90vh] max-w-[90vw] object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                            <p className="text-center text-sm text-white font-medium">
                                {zoomedImage.name}
                            </p>
                        </div>
                    </div>
                </div>
            )}

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
                        description="Upload foto komponen yang rusak (akan dikonversi ke AVIF)"
                        existingFiles={ticket.ct_bad_part || []}
                        disableWebpConversion={true}
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
                        description="Upload foto komponen pengganti (akan dikonversi ke AVIF)"
                        existingFiles={ticket.ct_good_part || []}
                        disableWebpConversion={true}
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
                    <h3 className="mb-4 font-semibold text-base">Preview File</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {data.ct_bad_part.map((file: File, idx: number) => {
                            const url = URL.createObjectURL(file);
                            return (
                                <div
                                    key={`bad-${idx}`}
                                    className="relative group border rounded-lg overflow-hidden aspect-square cursor-pointer hover:border-primary transition-colors"
                                    onClick={() => setZoomedImage({ url, name: file.name })}
                                >
                                    <img
                                        src={url}
                                        alt={file.name}
                                        className="object-cover w-full h-full"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="absolute bottom-2 left-2 text-white text-xs font-medium truncate max-w-[calc(100%-1rem)]">
                                            {file.name}
                                        </span>
                                    </div>
                                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                                        Bad Part
                                    </span>
                                </div>
                            );
                        })}
                        {data.ct_good_part.map((file: File, idx: number) => {
                            const url = URL.createObjectURL(file);
                            return (
                                <div
                                    key={`good-${idx}`}
                                    className="relative group border rounded-lg overflow-hidden aspect-square cursor-pointer hover:border-primary transition-colors"
                                    onClick={() => setZoomedImage({ url, name: file.name })}
                                >
                                    <img
                                        src={url}
                                        alt={file.name}
                                        className="object-cover w-full h-full"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="absolute bottom-2 left-2 text-white text-xs font-medium truncate max-w-[calc(100%-1rem)]">
                                            {file.name}
                                        </span>
                                    </div>
                                    <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                                        Good Part
                                    </span>
                                </div>
                            );
                        })}
                        {data.bap_file.map((file: File, idx: number) => {
                            const url = URL.createObjectURL(file);
                            return (
                                <div
                                    key={`bap-${idx}`}
                                    className="relative group border rounded-lg overflow-hidden aspect-square cursor-pointer hover:border-primary transition-colors"
                                    onClick={() => setZoomedImage({ url, name: file.name })}
                                >
                                    <img
                                        src={url}
                                        alt={file.name}
                                        className="object-cover w-full h-full"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="absolute bottom-2 left-2 text-white text-xs font-medium truncate max-w-[calc(100%-1rem)]">
                                            {file.name}
                                        </span>
                                    </div>
                                    <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
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
