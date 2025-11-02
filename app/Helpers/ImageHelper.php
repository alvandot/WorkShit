<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class ImageHelper
{
    /**
     * Check if AVIF encoding is supported by the current GD/Imagick installation.
     *
     * @return bool
     *
     * @phpstan-ignore-next-line
     */
    protected static function supportsAVIF(): bool
    {
        // Check if Imagick is available and supports AVIF
        if (extension_loaded('imagick') && class_exists('Imagick')) {
            try {
                /** @phpstan-ignore-next-line */
                $imagick = new \Imagick;
                $formats = $imagick->queryFormats('AVIF');
                if (! empty($formats)) {
                    return true;
                }
            } catch (\Exception $e) {
                // Imagick not available or error
            }
        }

        // Check if GD supports AVIF (PHP 8.1+)
        if (function_exists('imageavif')) {
            return true;
        }

        return false;
    }

    /**
     * Check if WebP encoding is supported by the current GD installation.
     */
    protected static function supportsWebP(): bool
    {
        return function_exists('imagewebp') && function_exists('imagecreatefromjpeg');
    }

    /**
     * Process and compress uploaded image.
     * For PDFs, store as-is without conversion.
     * For images, converts to AVIF (if supported) > WebP > PNG.
     *
     * @param  string  $directory  Storage directory (e.g., 'tickets/ct_bad_parts')
     * @param  int  $quality  Image quality (0-100, default: 80)
     * @param  bool  $convertToAVIF  Convert to AVIF format (default: true for ct_bad/good_part)
     * @return string Stored file path
     */
    public static function processAndStore(UploadedFile $file, string $directory, int $quality = 80, bool $convertToAVIF = false): string
    {
        $extension = strtolower($file->getClientOriginalExtension());

        // If PDF, store without conversion
        if ($extension === 'pdf') {
            return $file->store($directory, 'public');
        }

        // Process image files (jpg, jpeg, png, heic, webp)
        if (in_array($extension, ['jpg', 'jpeg', 'png', 'heic', 'webp'])) {
            try {
                // Determine output format based on conversion settings and support
                if ($convertToAVIF && static::supportsAVIF()) {
                    $outputFormat = 'avif';
                } elseif (static::supportsWebP()) {
                    $outputFormat = 'webp';
                } else {
                    $outputFormat = 'png';
                }

                $filename = uniqid().'_'.time().'.'.$outputFormat;
                $path = $directory.'/'.$filename;

                // Load image
                $image = Image::read($file);

                // Resize if too large (max 2000px width)
                if ($image->width() > 2000) {
                    $image->scale(width: 2000);
                }

                // Encode to appropriate format with quality setting
                if ($outputFormat === 'avif') {
                    $encodedImage = $image->toAvif($quality);
                } elseif ($outputFormat === 'webp') {
                    $encodedImage = $image->toWebp($quality);
                } else {
                    $encodedImage = $image->toPng($quality);
                }

                // Store in public disk
                Storage::disk('public')->put($path, (string) $encodedImage);

                Log::info('Image processed successfully', [
                    'original' => $file->getClientOriginalName(),
                    'format' => $outputFormat,
                    'path' => $path,
                    'size_original' => $file->getSize(),
                ]);

                return $path;
            } catch (\Exception $e) {
                // Log the error with more details
                Log::error('Image processing failed: '.$e->getMessage(), [
                    'file' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime' => $file->getMimeType(),
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
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
     */
    public static function deleteIfExists(?string $filePath): void
    {
        if ($filePath && Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }
    }
}
