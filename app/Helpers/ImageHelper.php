<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class ImageHelper
{
    /**
     * Check if WebP encoding is supported by the current GD installation.
     *
     * @return bool
     */
    protected static function supportsWebP(): bool
    {
        return function_exists('imagewebp') && function_exists('imagecreatefromjpeg');
    }

    /**
     * Process and compress uploaded image.
     * For PDFs, store as-is without conversion.
     * For images, converts to WebP if supported, otherwise optimizes as PNG.
     *
     * @param  UploadedFile  $file
     * @param  string  $directory  Storage directory (e.g., 'tickets/ct_bad_parts')
     * @param  int  $quality  Image quality (0-100, default: 80)
     * @return string  Stored file path
     */
    public static function processAndStore(UploadedFile $file, string $directory, int $quality = 80): string
    {
        $extension = strtolower($file->getClientOriginalExtension());

        // If PDF, store without conversion
        if ($extension === 'pdf') {
            return $file->store($directory, 'public');
        }

        // Process image files (jpg, jpeg, png)
        if (in_array($extension, ['jpg', 'jpeg', 'png'])) {
            try {
                // Determine output format based on WebP support
                $outputFormat = static::supportsWebP() ? 'webp' : 'png';
                $filename = uniqid().'_'.time().'.'.$outputFormat;
                $path = $directory.'/'.$filename;

                // Load image
                $image = Image::read($file);

                // Resize if too large (max 2000px width)
                if ($image->width() > 2000) {
                    $image->scale(width: 2000);
                }

                // Encode to appropriate format with quality setting
                $encodedImage = static::supportsWebP()
                    ? $image->toWebp($quality)
                    : $image->toPng($quality);

                // Store in public disk
                Storage::disk('public')->put($path, (string) $encodedImage);

                return $path;
            } catch (\Exception $e) {
                // Log the error with more details
                Log::error('Image processing failed: '.$e->getMessage(), [
                    'file' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime' => $file->getMimeType(),
                    'error' => $e->getMessage(),
                ]);

                // Fallback: store original file if processing fails
                return $file->store($directory, 'public');
            }
        }

        // Fallback: store as-is
        return $file->store($directory, 'public');
    }

    /**
     * Delete old file if exists.
     *
     * @param  string|null  $filePath
     * @return void
     */
    public static function deleteIfExists(?string $filePath): void
    {
        if ($filePath && Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }
    }
}
