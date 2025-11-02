/**
 * Animation Library
 * Reusable animation utilities and configurations
 */

/**
 * Transition durations (in ms)
 */
export const duration = {
    fast: 150,
    base: 200,
    slow: 300,
    slower: 500,
} as const;

/**
 * Easing functions
 */
export const easing = {
    // Standard easings
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

    // Custom easings
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    bounce: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
} as const;

/**
 * Tailwind animation classes
 */
export const animations = {
    // Fade animations
    fadeIn: 'animate-in fade-in',
    fadeOut: 'animate-out fade-out',

    // Slide animations
    slideInFromTop: 'animate-in slide-in-from-top',
    slideInFromBottom: 'animate-in slide-in-from-bottom',
    slideInFromLeft: 'animate-in slide-in-from-left',
    slideInFromRight: 'animate-in slide-in-from-right',

    slideOutToTop: 'animate-out slide-out-to-top',
    slideOutToBottom: 'animate-out slide-out-to-bottom',
    slideOutToLeft: 'animate-out slide-out-to-left',
    slideOutToRight: 'animate-out slide-out-to-right',

    // Zoom animations
    zoomIn: 'animate-in zoom-in',
    zoomOut: 'animate-out zoom-out',

    // Spin animations
    spin: 'animate-spin',
    ping: 'animate-ping',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',

    // Combined animations
    slideAndFadeIn: 'animate-in slide-in-from-bottom fade-in',
    slideAndFadeOut: 'animate-out slide-out-to-bottom fade-out',
} as const;

/**
 * Duration classes
 */
export const durationClasses = {
    fast: 'duration-150',
    base: 'duration-200',
    slow: 'duration-300',
    slower: 'duration-500',
} as const;

/**
 * Transition classes
 */
export const transitions = {
    all: 'transition-all',
    colors: 'transition-colors',
    opacity: 'transition-opacity',
    shadow: 'transition-shadow',
    transform: 'transition-transform',
} as const;

/**
 * Hover scale effects
 */
export const hoverScale = {
    sm: 'hover:scale-105',
    md: 'hover:scale-110',
    lg: 'hover:scale-125',
} as const;

/**
 * Pre-configured animation combinations
 */
export const presets = {
    // Button interactions
    button: `${transitions.colors} ${durationClasses.base} ${transitions.transform}`,
    buttonHover: `${transitions.all} ${durationClasses.base} hover:scale-105`,

    // Card interactions
    card: `${transitions.all} ${durationClasses.base}`,
    cardHover: `${transitions.all} ${durationClasses.base} hover:shadow-lg hover:-translate-y-1`,

    // Modal/Dialog
    modal: `${animations.fadeIn} ${durationClasses.base}`,
    modalBackdrop: `${animations.fadeIn} ${durationClasses.fast}`,

    // Dropdown/Menu
    dropdown: `${animations.slideAndFadeIn} ${durationClasses.fast}`,
    dropdownItem: `${transitions.colors} ${durationClasses.fast}`,

    // Toast/Notification
    toast: `${animations.slideInFromRight} ${durationClasses.base}`,
    toastExit: `${animations.slideOutToRight} ${durationClasses.base}`,

    // Loading states
    skeleton: `${animations.pulse}`,
    spinner: `${animations.spin}`,

    // List items
    listItem: `${transitions.colors} ${durationClasses.fast}`,
    listItemHover: `${transitions.all} ${durationClasses.fast} hover:bg-slate-50 dark:hover:bg-slate-800/50`,
} as const;

/**
 * Framer Motion variants for complex animations
 */
export const motionVariants = {
    // Fade variants
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },

    // Slide variants
    slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    },

    slideDown: {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
    },

    slideLeft: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    },

    slideRight: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
    },

    // Scale variants
    scale: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
    },

    // Stagger children
    stagger: {
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    },

    // List item
    listItem: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
    },
};

/**
 * Spring configurations
 */
export const springs = {
    // Smooth spring
    smooth: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
    },

    // Bouncy spring
    bouncy: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
    },

    // Gentle spring
    gentle: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
    },
} as const;

/**
 * Helper function to combine animation classes
 */
export function combineAnimations(...animations: string[]): string {
    return animations.filter(Boolean).join(' ');
}

/**
 * Helper to get transition with duration
 */
export function transition(
    type: keyof typeof transitions = 'all',
    speed: keyof typeof durationClasses = 'base',
): string {
    return `${transitions[type]} ${durationClasses[speed]}`;
}
