import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Maximize2,
    X,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import { useState } from 'react';

interface MediaItem {
    url: string;
    title?: string;
    description?: string;
    type?: 'image' | 'video';
}

interface MediaGalleryProps {
    items: MediaItem[];
    columns?: 2 | 3 | 4;
    className?: string;
}

export function MediaGallery({
    items,
    columns = 3,
    className,
}: MediaGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [zoom, setZoom] = useState(100);

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setLightboxOpen(true);
        setZoom(100);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        setZoom(100);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setZoom(100);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
        setZoom(100);
    };

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 25, 200));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 25, 50));
    };

    const handleDownload = () => {
        const item = items[currentIndex];
        const link = document.createElement('a');
        link.href = item.url;
        link.download = item.title || 'image';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const gridCols = {
        2: 'grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-2 lg:grid-cols-4',
    };

    if (items.length === 0) {
        return (
            <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 text-sm text-muted-foreground">
                No media available
            </div>
        );
    }

    return (
        <>
            {/* Gallery Grid */}
            <div className={cn('grid gap-4', gridCols[columns], className)}>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 border-border transition-all hover:border-primary hover:shadow-lg"
                        onClick={() => openLightbox(index)}
                    >
                        {item.type === 'video' ? (
                            <video
                                src={item.url}
                                className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                                muted
                            />
                        ) : (
                            <img
                                src={item.url}
                                alt={item.title || `Media ${index + 1}`}
                                className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                                loading="lazy"
                            />
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/40">
                            <Maximize2 className="size-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>

                        {/* Title Badge */}
                        {item.title && (
                            <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                                <p className="truncate text-sm font-medium text-white">
                                    {item.title}
                                </p>
                            </div>
                        )}

                        {/* Index Badge */}
                        <div className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                            {index + 1}/{items.length}
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Dialog */}
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                <DialogContent className="max-w-7xl p-0">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Image Viewer</DialogTitle>
                    </DialogHeader>

                    {/* Close Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 z-50 rounded-full bg-black/60 text-white hover:bg-black/80 hover:text-white"
                        onClick={closeLightbox}
                    >
                        <X className="size-5" />
                    </Button>

                    {/* Navigation & Controls */}
                    <div className="absolute top-4 left-4 z-50 flex gap-2">
                        {/* Zoom Controls */}
                        <div className="flex gap-1 rounded-full bg-black/60 p-1 backdrop-blur-sm">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-full text-white hover:bg-white/20 hover:text-white"
                                onClick={handleZoomOut}
                                disabled={zoom <= 50}
                            >
                                <ZoomOut className="size-4" />
                            </Button>
                            <span className="flex items-center px-2 text-xs font-semibold text-white">
                                {zoom}%
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-full text-white hover:bg-white/20 hover:text-white"
                                onClick={handleZoomIn}
                                disabled={zoom >= 200}
                            >
                                <ZoomIn className="size-4" />
                            </Button>
                        </div>

                        {/* Download Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-full bg-black/60 text-white hover:bg-black/80 hover:text-white"
                            onClick={handleDownload}
                        >
                            <Download className="size-4" />
                        </Button>
                    </div>

                    {/* Main Image */}
                    <div className="relative flex min-h-[60vh] items-center justify-center bg-black p-12">
                        {items[currentIndex].type === 'video' ? (
                            <video
                                src={items[currentIndex].url}
                                className="max-h-[80vh] max-w-full object-contain transition-transform duration-300"
                                style={{ transform: `scale(${zoom / 100})` }}
                                controls
                            />
                        ) : (
                            <img
                                src={items[currentIndex].url}
                                alt={items[currentIndex].title || 'Image'}
                                className="max-h-[80vh] max-w-full object-contain transition-transform duration-300"
                                style={{ transform: `scale(${zoom / 100})` }}
                            />
                        )}

                        {/* Navigation Arrows */}
                        {items.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-1/2 left-4 size-12 -translate-y-1/2 rounded-full bg-black/60 text-white hover:bg-black/80 hover:text-white"
                                    onClick={goToPrevious}
                                >
                                    <ChevronLeft className="size-6" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-1/2 right-4 size-12 -translate-y-1/2 rounded-full bg-black/60 text-white hover:bg-black/80 hover:text-white"
                                    onClick={goToNext}
                                >
                                    <ChevronRight className="size-6" />
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Image Info */}
                    <div className="border-t bg-background p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold">
                                    {items[currentIndex].title ||
                                        `Image ${currentIndex + 1}`}
                                </h3>
                                {items[currentIndex].description && (
                                    <p className="text-sm text-muted-foreground">
                                        {items[currentIndex].description}
                                    </p>
                                )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {currentIndex + 1} / {items.length}
                            </div>
                        </div>
                    </div>

                    {/* Thumbnail Strip */}
                    {items.length > 1 && (
                        <div className="border-t bg-background p-4">
                            <div className="flex gap-2 overflow-x-auto">
                                {items.map((item, index) => (
                                    <button
                                        key={index}
                                        className={cn(
                                            'size-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                                            index === currentIndex
                                                ? 'border-primary ring-2 ring-primary/20'
                                                : 'border-border hover:border-primary/50',
                                        )}
                                        onClick={() => {
                                            setCurrentIndex(index);
                                            setZoom(100);
                                        }}
                                    >
                                        {item.type === 'video' ? (
                                            <video
                                                src={item.url}
                                                className="size-full object-cover"
                                                muted
                                            />
                                        ) : (
                                            <img
                                                src={item.url}
                                                alt={
                                                    item.title ||
                                                    `Thumbnail ${index + 1}`
                                                }
                                                className="size-full object-cover"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

// Before/After Comparison Component
interface BeforeAfterProps {
    before: string;
    after: string;
    className?: string;
}

export function BeforeAfterComparison({
    before,
    after,
    className,
}: BeforeAfterProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
        setSliderPosition(percent);
    };

    return (
        <div
            className={cn(
                'group relative aspect-video overflow-hidden rounded-lg border-2 border-border',
                className,
            )}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* After Image (Background) */}
            <img
                src={after}
                alt="After"
                className="absolute inset-0 size-full object-cover"
            />

            {/* Before Image (Clipped) */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={before}
                    alt="Before"
                    className="absolute inset-0 size-full object-cover"
                />
            </div>

            {/* Slider */}
            <div
                className="absolute inset-y-0 z-10 w-1 cursor-ew-resize bg-white shadow-lg"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex size-10 items-center justify-center rounded-full bg-white shadow-xl">
                        <ChevronLeft className="-mr-1 size-4" />
                        <ChevronRight className="-ml-1 size-4" />
                    </div>
                </div>
            </div>

            {/* Labels */}
            <div className="pointer-events-none absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
                Before
            </div>
            <div className="pointer-events-none absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
                After
            </div>
        </div>
    );
}
