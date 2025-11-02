import { useEffect, useRef, useState } from 'react';

interface LazyImageOptions {
    src: string;
    alt: string;
    className?: string;
    placeholder?: string;
    webpSrc?: string;
    onLoad?: () => void;
    onError?: () => void;
}

export const useLazyImage = (options: LazyImageOptions) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '50px', // Start loading 50px before the image enters the viewport
                threshold: 0.1,
            },
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
        options.onLoad?.();
    };

    const handleError = () => {
        setIsError(true);
        options.onError?.();
    };

    // Generate WebP source if not provided
    const webpSrc = options.webpSrc || generateWebPSrc(options.src);

    return {
        imgRef,
        isLoaded,
        isError,
        isInView,
        src: isInView ? options.src : options.placeholder || '',
        webpSrc: isInView ? webpSrc : '',
        alt: options.alt,
        className: options.className,
        onLoad: handleLoad,
        onError: handleError,
    };
};

// Helper function to generate WebP version of image URL
const generateWebPSrc = (src: string): string => {
    // For demo purposes, we'll assume images are served from a CDN that supports WebP
    // In a real app, you might use a service like Cloudinary, Imgix, or your own image processing
    if (src.includes('unsplash.com') || src.includes('placeholder.com')) {
        // These services support WebP via Accept header, but we'll add format parameter
        return src + (src.includes('?') ? '&' : '?') + 'fm=webp';
    }

    // For local images, you might want to serve WebP versions
    // This is a simple example - in production you'd want more sophisticated handling
    const extension = src.split('.').pop()?.toLowerCase();
    if (extension && ['jpg', 'jpeg', 'png'].includes(extension)) {
        return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }

    return src;
};

// LazyImage component
export const LazyImage = (props: LazyImageOptions) => {
    const {
        imgRef,
        isLoaded,
        isError,
        isInView,
        src,
        webpSrc,
        alt,
        className,
        onLoad,
        onError,
    } = useLazyImage(props);

    return (
        <div className={`relative ${className}`}>
            {/* Show skeleton/placeholder while loading */}
            {!isLoaded && !isError && (
                <div className="absolute inset-0 animate-pulse rounded bg-muted" />
            )}

            {/* WebP source for modern browsers */}
            {isInView && webpSrc && (
                <picture>
                    <source srcSet={webpSrc} type="image/webp" />
                    <img
                        ref={imgRef}
                        src={src}
                        alt={alt}
                        className={`transition-opacity duration-300 ${
                            isLoaded ? 'opacity-100' : 'opacity-0'
                        } ${className}`}
                        onLoad={onLoad}
                        onError={onError}
                        loading="lazy"
                    />
                </picture>
            )}

            {/* Fallback for older browsers */}
            {isInView && !webpSrc && (
                <img
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    className={`transition-opacity duration-300 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    } ${className}`}
                    onLoad={onLoad}
                    onError={onError}
                    loading="lazy"
                />
            )}

            {/* Error state */}
            {isError && (
                <div className="flex items-center justify-center rounded bg-muted/50 text-sm text-muted-foreground">
                    Failed to load image
                </div>
            )}
        </div>
    );
};
