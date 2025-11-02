import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

// Fade in animation
export function FadeIn({
    children,
    delay = 0,
    className,
}: {
    children: ReactNode;
    delay?: number;
    className?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Scale on hover
export function ScaleOnHover({
    children,
    scale = 1.05,
    className,
}: {
    children: ReactNode;
    scale?: number;
    className?: string;
}) {
    return (
        <motion.div
            whileHover={{ scale }}
            transition={{ duration: 0.2 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Bounce button
export function BounceButton({
    children,
    onClick,
    className,
    disabled = false,
}: {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'transition-colors duration-200',
                disabled && 'opacity-50 cursor-not-allowed',
                className,
            )}
        >
            {children}
        </motion.button>
    );
}

// Slide in from left
export function SlideInLeft({
    children,
    delay = 0,
    className,
}: {
    children: ReactNode;
    delay?: number;
    className?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Slide in from right
export function SlideInRight({
    children,
    delay = 0,
    className,
}: {
    children: ReactNode;
    delay?: number;
    className?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Stagger children
export function StaggerChildren({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        staggerChildren: 0.1,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Stagger item (use with StaggerChildren)
export function StaggerItem({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Pulse animation
export function Pulse({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            animate={{
                scale: [1, 1.05, 1],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Shake animation (for errors)
export function Shake({
    children,
    trigger,
    className,
}: {
    children: ReactNode;
    trigger: boolean;
    className?: string;
}) {
    return (
        <motion.div
            animate={
                trigger
                    ? {
                          x: [-10, 10, -10, 10, 0],
                      }
                    : {}
            }
            transition={{ duration: 0.5 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Rotate on hover
export function RotateOnHover({
    children,
    degrees = 180,
    className,
}: {
    children: ReactNode;
    degrees?: number;
    className?: string;
}) {
    return (
        <motion.div
            whileHover={{ rotate: degrees }}
            transition={{ duration: 0.3 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Card with hover lift
export function LiftCard({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            whileHover={{
                y: -8,
                boxShadow:
                    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            }}
            transition={{ duration: 0.2 }}
            className={cn(
                'rounded-lg border bg-card transition-colors duration-200',
                className,
            )}
        >
            {children}
        </motion.div>
    );
}

// Progress bar animation
export function AnimatedProgress({
    value,
    className,
}: {
    value: number;
    className?: string;
}) {
    return (
        <div className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            />
        </div>
    );
}

// Number counter animation
export function CountUp({
    value,
    duration = 1,
    className,
}: {
    value: number;
    duration?: number;
    className?: string;
}) {
    return (
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={className}
        >
            <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration }}
            >
                {value}
            </motion.span>
        </motion.span>
    );
}

// Flip card
export function FlipCard({
    front,
    back,
    className,
}: {
    front: ReactNode;
    back: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            whileHover={{ rotateY: 180 }}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: 'preserve-3d' }}
            className={cn('relative', className)}
        >
            <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                {front}
            </div>
            <div
                className="absolute inset-0"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
                {back}
            </div>
        </motion.div>
    );
}
