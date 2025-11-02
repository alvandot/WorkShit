import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

interface SkeletonConfig {
    width?: string | number;
    height?: string | number;
    className?: string;
    count?: number;
    variant?: 'default' | 'circle' | 'text' | 'card' | 'table-row';
}

interface UseSkeletonOptions {
    isLoading: boolean;
    delay?: number; // Delay before showing skeleton (ms)
    minDuration?: number; // Minimum duration to show skeleton (ms)
}

// Hook for managing skeleton loading states
export const useSkeleton = (options: UseSkeletonOptions) => {
    const { isLoading, delay = 0, minDuration = 0 } = options;
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);

    useEffect(() => {
        let delayTimer: NodeJS.Timeout;
        let minDurationTimer: NodeJS.Timeout;

        if (isLoading) {
            // Start delay timer
            delayTimer = setTimeout(() => {
                setShowSkeleton(true);
                setStartTime(Date.now());
            }, delay);
        } else {
            // Clear delay timer if still pending
            if (delayTimer) {
                clearTimeout(delayTimer);
            }

            // Handle minimum duration
            if (startTime && minDuration > 0) {
                const elapsed = Date.now() - startTime;
                const remaining = minDuration - elapsed;

                if (remaining > 0) {
                    minDurationTimer = setTimeout(() => {
                        setShowSkeleton(false);
                        setStartTime(null);
                    }, remaining);
                } else {
                    setShowSkeleton(false);
                    setStartTime(null);
                }
            } else {
                setShowSkeleton(false);
                setStartTime(null);
            }
        }

        return () => {
            if (delayTimer) clearTimeout(delayTimer);
            if (minDurationTimer) clearTimeout(minDurationTimer);
        };
    }, [isLoading, delay, minDuration, startTime]);

    return showSkeleton;
};

// Pre-configured skeleton components
export const SkeletonText = ({
    className,
    ...props
}: Omit<SkeletonConfig, 'variant'>) => (
    <Skeleton
        className={`h-4 ${className || ''}`}
        style={{
            width: props.width || '100%',
            height: props.height || '1rem',
        }}
        {...props}
    />
);

export const SkeletonCircle = ({
    className,
    ...props
}: Omit<SkeletonConfig, 'variant'>) => (
    <Skeleton
        className={`rounded-full ${className || ''}`}
        style={{
            width: props.width || '2.5rem',
            height: props.height || '2.5rem',
        }}
        {...props}
    />
);

export const SkeletonCard = ({
    className,
    ...props
}: Omit<SkeletonConfig, 'variant'>) => (
    <div className={`space-y-3 rounded-lg border p-4 ${className || ''}`}>
        <SkeletonCircle width="3rem" height="3rem" />
        <div className="space-y-2">
            <SkeletonText width="60%" />
            <SkeletonText width="80%" />
            <SkeletonText width="40%" />
        </div>
    </div>
);

export const SkeletonTableRow = ({
    className,
    count = 5,
    ...props
}: SkeletonConfig) => (
    <div className={`flex space-x-4 ${className || ''}`}>
        {Array.from({ length: count }, (_, i) => (
            <SkeletonText
                key={i}
                width={`${60 + Math.random() * 40}%`}
                className="flex-1"
                {...props}
            />
        ))}
    </div>
);

// Skeleton list component
export const SkeletonList = ({
    count = 3,
    itemComponent = SkeletonCard,
    className,
    ...props
}: {
    count?: number;
    itemComponent?: React.ComponentType<SkeletonConfig>;
    className?: string;
} & SkeletonConfig) => {
    const ItemComponent = itemComponent;

    return (
        <div className={`space-y-4 ${className || ''}`}>
            {Array.from({ length: count }, (_, i) => (
                <ItemComponent key={i} {...props} />
            ))}
        </div>
    );
};

// Hook for progressive loading (show content as it loads)
export const useProgressiveLoading = <T,>(
    items: T[],
    loadingStates: boolean[],
) => {
    const [visibleItems, setVisibleItems] = useState<T[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (items.length === 0) return;

        const interval = setInterval(() => {
            if (currentIndex < items.length && !loadingStates[currentIndex]) {
                setVisibleItems((prev) => [...prev, items[currentIndex]]);
                setCurrentIndex((prev) => prev + 1);
            }
        }, 100); // Stagger loading by 100ms

        return () => clearInterval(interval);
    }, [items, loadingStates, currentIndex]);

    return visibleItems;
};

// Utility for creating staggered loading animations
export const createStaggeredAnimation = (index: number, baseDelay = 100) => ({
    animationDelay: `${index * baseDelay}ms`,
    animationFillMode: 'both' as const,
});

// Hook for managing loading states with optimistic updates
export const useOptimisticLoading = <T,>(
    initialData: T,
    loadingAction: () => Promise<T>,
    options: {
        optimisticUpdate?: (currentData: T) => T;
        rollbackOnError?: boolean;
    } = {},
) => {
    const { optimisticUpdate, rollbackOnError = true } = options;
    const [data, setData] = useState<T>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const executeAction = async () => {
        setIsLoading(true);
        setError(null);

        // Apply optimistic update
        if (optimisticUpdate) {
            setData(optimisticUpdate(data));
        }

        try {
            const result = await loadingAction();
            setData(result);
        } catch (err) {
            setError(err as Error);

            // Rollback on error if enabled
            if (rollbackOnError && optimisticUpdate) {
                setData(initialData);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        data,
        isLoading,
        error,
        executeAction,
        showSkeleton: useSkeleton({ isLoading }),
    };
};
