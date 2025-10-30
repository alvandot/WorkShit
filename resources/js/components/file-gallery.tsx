import { useState } from 'react';
import { X, Download, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface FileGalleryProps {
  files: string[];
  label: string;
  className?: string;
}

export default function FileGallery({ files, label, className }: FileGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!files || files.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + files.length) % files.length);
  };

  const goToNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % files.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  return (
    <>
      <div className={cn('space-y-3', className)}>
        {/* Label */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{label}</h3>
          <span className="text-sm text-muted-foreground">
            {files.length} {files.length === 1 ? 'file' : 'files'}
          </span>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {files.map((file, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-lg border overflow-hidden bg-muted/50 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
              onClick={() => openLightbox(index)}
            >
              {/* Image */}
              <img
                src={`/storage/${file}`}
                alt={`${label} ${index + 1}`}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="size-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      openLightbox(index);
                    }}
                  >
                    <ZoomIn className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="size-8 p-0"
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a href={`/storage/${file}`} download>
                      <Download className="size-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Image Number */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded-md">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent
          className="max-w-7xl w-full h-[90vh] p-0"
          onKeyDown={handleKeyDown}
        >
          {selectedIndex !== null && (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                onClick={closeLightbox}
              >
                <X className="size-6" />
              </Button>

              {/* Previous Button */}
              {files.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 z-50 text-white hover:bg-white/20 size-12"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="size-8" />
                </Button>
              )}

              {/* Image */}
              <img
                src={`/storage/${files[selectedIndex]}`}
                alt={`${label} ${selectedIndex + 1}`}
                className="max-w-full max-h-full object-contain animate-in zoom-in-95 fade-in-0 duration-300"
              />

              {/* Next Button */}
              {files.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 z-50 text-white hover:bg-white/20 size-12"
                  onClick={goToNext}
                >
                  <ChevronRight className="size-8" />
                </Button>
              )}

              {/* Image Info */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/70 text-white text-sm rounded-md">
                {selectedIndex + 1} / {files.length}
              </div>

              {/* Download Button */}
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-4 right-4 z-50"
                asChild
              >
                <a href={`/storage/${files[selectedIndex]}`} download>
                  <Download className="size-4 mr-2" />
                  Download
                </a>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
