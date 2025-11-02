import { cn } from '@/lib/utils';

interface ProgressBarProps {
    value: number; // 0-100
    label?: string;
    showPercentage?: boolean;
    variant?: 'default' | 'gradient' | 'striped' | 'animated';
    size?: 'sm' | 'md' | 'lg';
    colorScheme?:
        | 'blue'
        | 'purple'
        | 'emerald'
        | 'amber'
        | 'rose'
        | 'gradient';
    className?: string;
}

const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
};

const colorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    gradient: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
};

export function ProgressBar({
    value,
    label,
    showPercentage = true,
    variant = 'default',
    size = 'md',
    colorScheme = 'blue',
    className,
}: ProgressBarProps) {
    const percentage = Math.min(100, Math.max(0, value));

    return (
        <div className={cn('space-y-2', className)}>
            {(label || showPercentage) && (
                <div className="flex items-center justify-between text-sm">
                    {label && (
                        <span className="font-medium text-foreground">
                            {label}
                        </span>
                    )}
                    {showPercentage && (
                        <span className="font-semibold tabular-nums text-muted-foreground">
                            {percentage}%
                        </span>
                    )}
                </div>
            )}
            <div
                className={cn(
                    'w-full overflow-hidden rounded-full bg-muted',
                    sizeClasses[size],
                )}
            >
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-500 ease-out',
                        colorClasses[colorScheme],
                        variant === 'striped' &&
                            'bg-[length:1rem_1rem] bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)]',
                        variant === 'animated' && 'animate-pulse',
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

// Multi-step progress bar
interface StepProgressProps {
    currentStep: number;
    totalSteps: number;
    steps?: Array<{ label: string; description?: string }>;
    className?: string;
}

export function StepProgress({
    currentStep,
    totalSteps,
    steps,
    className,
}: StepProgressProps) {
    return (
        <div className={cn('space-y-4', className)}>
            {steps ? (
                <div className="flex justify-between">
                    {steps.map((step, index) => {
                        const stepNumber = index + 1;
                        const isCompleted = stepNumber < currentStep;
                        const isCurrent = stepNumber === currentStep;

                        return (
                            <div
                                key={index}
                                className="flex flex-1 flex-col items-center"
                            >
                                <div
                                    className={cn(
                                        'flex size-8 items-center justify-center rounded-full text-sm font-semibold transition-all',
                                        isCompleted &&
                                            'bg-emerald-500 text-white',
                                        isCurrent &&
                                            'bg-blue-500 text-white ring-4 ring-blue-500/20',
                                        !isCompleted &&
                                            !isCurrent &&
                                            'bg-muted text-muted-foreground',
                                    )}
                                >
                                    {stepNumber}
                                </div>
                                <div className="mt-2 text-center">
                                    <div
                                        className={cn(
                                            'text-xs font-medium',
                                            isCurrent && 'text-foreground',
                                            !isCurrent && 'text-muted-foreground',
                                        )}
                                    >
                                        {step.label}
                                    </div>
                                    {step.description && (
                                        <div className="text-[10px] text-muted-foreground">
                                            {step.description}
                                        </div>
                                    )}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="mt-4 h-0.5 w-full bg-muted">
                                        <div
                                            className={cn(
                                                'h-full bg-emerald-500 transition-all duration-500',
                                                isCompleted ? 'w-full' : 'w-0',
                                            )}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    {Array.from({ length: totalSteps }).map((_, index) => {
                        const stepNumber = index + 1;
                        const isCompleted = stepNumber <= currentStep;

                        return (
                            <div
                                key={index}
                                className={cn(
                                    'h-2 flex-1 rounded-full transition-all duration-300',
                                    isCompleted ? 'bg-blue-500' : 'bg-muted',
                                )}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
