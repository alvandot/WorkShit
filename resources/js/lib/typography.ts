/**
 * Typography System
 * Consistent text styles across the application
 */

export const typography = {
    // Headings
    h1: 'text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl',
    h2: 'text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl',
    h3: 'text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl',
    h4: 'text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl',
    h5: 'text-lg font-semibold text-slate-900 dark:text-slate-100',
    h6: 'text-base font-semibold text-slate-900 dark:text-slate-100',

    // Body text
    body: {
        xl: 'text-xl text-slate-700 dark:text-slate-300',
        lg: 'text-lg text-slate-700 dark:text-slate-300',
        base: 'text-base text-slate-700 dark:text-slate-300',
        sm: 'text-sm text-slate-600 dark:text-slate-400',
        xs: 'text-xs text-slate-600 dark:text-slate-400',
    },

    // Special text
    lead: 'text-xl text-slate-600 dark:text-slate-400 leading-relaxed',
    muted: 'text-sm text-slate-500 dark:text-slate-500',
    label: 'text-sm font-medium text-slate-700 dark:text-slate-300',
    caption: 'text-xs text-slate-500 dark:text-slate-500',
    code: 'font-mono text-sm bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded',

    // Links
    link: 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline-offset-4 hover:underline',
    linkMuted:
        'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:underline',

    // Numbers and metrics
    metric: {
        value: 'text-3xl font-bold text-slate-900 dark:text-slate-100',
        label: 'text-sm font-medium text-slate-600 dark:text-slate-400',
        change: 'text-sm font-medium text-emerald-600 dark:text-emerald-400',
    },

    // Table text
    table: {
        header: 'text-sm font-semibold text-slate-900 dark:text-slate-100',
        cell: 'text-sm text-slate-700 dark:text-slate-300',
        footer: 'text-sm font-medium text-slate-600 dark:text-slate-400',
    },
};

/**
 * Font weight utilities
 */
export const fontWeight = {
    thin: 'font-thin',
    extralight: 'font-extralight',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
    black: 'font-black',
};

/**
 * Line height utilities
 */
export const lineHeight = {
    none: 'leading-none',
    tight: 'leading-tight',
    snug: 'leading-snug',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose',
};

/**
 * Letter spacing utilities
 */
export const letterSpacing = {
    tighter: 'tracking-tighter',
    tight: 'tracking-tight',
    normal: 'tracking-normal',
    wide: 'tracking-wide',
    wider: 'tracking-wider',
    widest: 'tracking-widest',
};
