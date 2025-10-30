import { X, Upload, FileImage, File, Check, Loader2 } from 'lucide-react';
import { useState, useRef, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileWithPreview {
  file: File;
  preview: string;
  id: string;
}

interface FileUploadWithPreviewProps {
  label: string;
  name: string;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  onChange: (files: File[]) => void;
  value?: File[];
  error?: string;
  description?: string;
  existingFiles?: string[]; // URLs of existing uploaded files
}

// Convert image to WebP format with compression
async function convertToWebP(file: File, quality: number = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image on canvas
        ctx.drawImage(img, 0, 0);

        // Convert to WebP
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not convert image'));
              return;
            }

            // Create new File from blob - handle browser compatibility
            try {
              // Modern browsers support File constructor
              const webpFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, '.webp'),
                { type: 'image/webp', lastModified: Date.now() }
              );
              resolve(webpFile);
            } catch (e) {
              // Fallback for browsers that don't support File constructor
              // Create a blob with file-like properties
              const webpBlob = blob as any;
              webpBlob.name = file.name.replace(/\.[^/.]+$/, '.webp');
              webpBlob.lastModified = Date.now();
              webpBlob.lastModifiedDate = new Date();
              resolve(webpBlob as File);
            }
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => reject(new Error('Could not load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

export default function FileUploadWithPreview({
  label,
  name,
  accept = 'image/*',
  maxSize = 10,
  multiple = true,
  onChange,
  value = [],
  error,
  description,
  existingFiles = [],
}: FileUploadWithPreviewProps) {
  const [filesWithPreview, setFilesWithPreview] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (newFiles: FileList | null) => {
    if (!newFiles || newFiles.length === 0) return;

    setIsConverting(true);
    const filesArray = Array.from(newFiles);
    const validFiles: File[] = [];

    try {
      // Validate and convert files
      for (const file of filesArray) {
        // Check file type - must be image
        if (!file.type.startsWith('image/')) {
          alert(`File ${file.name} is not an image. Only images are allowed.`);
          continue;
        }

        // Check file size (before compression)
        if (file.size > maxSize * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB`);
          continue;
        }

        // Convert to WebP
        try {
          const webpFile = await convertToWebP(file, 0.85);
          validFiles.push(webpFile);
        } catch (err) {
          console.error(`Error converting ${file.name}:`, err);
          alert(`Could not convert ${file.name}. Please try another file.`);
        }
      }

      if (validFiles.length === 0) {
        setIsConverting(false);
        return;
      }

      // Create previews for valid files
      const newFilesWithPreview: FileWithPreview[] = validFiles.map((file) => {
        const preview = URL.createObjectURL(file);

        return {
          file,
          preview,
          id: Math.random().toString(36).substring(7),
        };
      });

      const updatedFiles = multiple
        ? [...filesWithPreview, ...newFilesWithPreview]
        : newFilesWithPreview;

      setFilesWithPreview(updatedFiles);
      onChange(updatedFiles.map(f => f.file));

      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } finally {
      setIsConverting(false);
    }
  };

  const removeFile = (id: string) => {
    const updatedFiles = filesWithPreview.filter(f => f.id !== id);
    setFilesWithPreview(updatedFiles);
    onChange(updatedFiles.map(f => f.file));

    // Revoke preview URL to free memory
    const fileToRemove = filesWithPreview.find(f => f.id === id);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Drop Zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300',
          'hover:border-primary hover:bg-primary/5',
          isDragging && 'border-primary bg-primary/10 scale-[1.02]',
          error && 'border-destructive',
          'group'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Upload Icon with Animation */}
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            'rounded-full bg-primary/10 p-4 transition-all duration-300',
            'group-hover:bg-primary/20 group-hover:scale-110',
            isDragging && 'scale-110 bg-primary/20',
            showSuccess && 'bg-green-500/20',
            isConverting && 'bg-blue-500/20'
          )}>
            {isConverting ? (
              <Loader2 className="size-8 text-blue-500 animate-spin" />
            ) : showSuccess ? (
              <Check className="size-8 text-green-500 animate-in zoom-in-50 duration-200" />
            ) : (
              <Upload className={cn(
                'size-8 text-primary transition-transform duration-300',
                isDragging && 'scale-110 animate-bounce'
              )} />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isConverting ? 'Converting to WebP...' : isDragging ? 'Drop images here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-muted-foreground">
              Images only (JPG, PNG, GIF) - will be converted to WebP
              {multiple && ' (multiple files allowed)'}
            </p>
          </div>
        </div>

        {/* Success Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-500/10 rounded-lg animate-in fade-in-0 duration-300">
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <Check className="size-5" />
              <span>Files added successfully!</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}

      {/* Existing Files Preview */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Existing Files</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {existingFiles.map((fileUrl, index) => (
              <div
                key={index}
                className="group relative aspect-square rounded-lg border overflow-hidden bg-muted/50 hover:bg-muted transition-colors duration-200"
              >
                {fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                  <img
                    src={`/storage/${fileUrl}`}
                    alt={`Existing file ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4">
                    <File className="size-8 text-muted-foreground mb-2" />
                    <p className="text-xs text-center text-muted-foreground break-all">
                      {fileUrl.split('/').pop()}
                    </p>
                  </div>
                )}

                {/* View Link */}
                <a
                  href={`/storage/${fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Button size="sm" variant="secondary" type="button">
                    View
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Files Preview */}
      {filesWithPreview.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            New Files ({filesWithPreview.length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filesWithPreview.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square rounded-lg border overflow-hidden bg-muted/50 animate-in zoom-in-95 fade-in-0 duration-300"
              >
                {/* Preview */}
                {item.preview ? (
                  <img
                    src={item.preview}
                    alt={item.file.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4">
                    <FileImage className="size-8 text-muted-foreground mb-2" />
                    <p className="text-xs text-center text-muted-foreground break-all">
                      {item.file.name}
                    </p>
                  </div>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeFile(item.id)}
                  className={cn(
                    'absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground',
                    'opacity-0 group-hover:opacity-100 transition-all duration-200',
                    'hover:scale-110 hover:bg-destructive/90',
                    'focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2'
                  )}
                  aria-label="Remove file"
                >
                  <X className="size-4" />
                </button>

                {/* File Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="text-xs text-white truncate">{item.file.name}</p>
                  <p className="text-xs text-white/70">
                    {(item.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
