/**
 * Semantic Color System
 * WCAG AA compliant colors with dark mode support
 */

export const semanticColors = {
    // Status colors with better accessibility
    status: {
        open: {
            bg: 'bg-blue-50 dark:bg-blue-950/30',
            text: 'text-blue-700 dark:text-blue-300',
            border: 'border-blue-200 dark:border-blue-800',
            ring: 'ring-blue-500/20',
            badge: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800',
        },
        'need to receive': {
            bg: 'bg-amber-50 dark:bg-amber-950/30',
            text: 'text-amber-700 dark:text-amber-300',
            border: 'border-amber-200 dark:border-amber-800',
            ring: 'ring-amber-500/20',
            badge: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800',
        },
        'in progress': {
            bg: 'bg-purple-50 dark:bg-purple-950/30',
            text: 'text-purple-700 dark:text-purple-300',
            border: 'border-purple-200 dark:border-purple-800',
            ring: 'ring-purple-500/20',
            badge: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-800',
        },
        finish: {
            bg: 'bg-emerald-50 dark:bg-emerald-950/30',
            text: 'text-emerald-700 dark:text-emerald-300',
            border: 'border-emerald-200 dark:border-emerald-800',
            ring: 'ring-emerald-500/20',
            badge: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-800',
        },
        closed: {
            bg: 'bg-slate-50 dark:bg-slate-950/30',
            text: 'text-slate-700 dark:text-slate-300',
            border: 'border-slate-200 dark:border-slate-800',
            ring: 'ring-slate-500/20',
            badge: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/40 dark:text-slate-200 dark:border-slate-800',
        },
    },

    // Priority indicators
    priority: {
        high: {
            bg: 'bg-red-500',
            text: 'text-white',
            badge: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800',
        },
        medium: {
            bg: 'bg-orange-500',
            text: 'text-white',
            badge: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-200 dark:border-orange-800',
        },
        low: {
            bg: 'bg-blue-500',
            text: 'text-white',
            badge: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800',
        },
    },

    // Action colors
    actions: {
        create: {
            bg: 'bg-green-600 hover:bg-green-700 active:bg-green-800',
            text: 'text-white',
            outline:
                'border-green-600 text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/30',
        },
        update: {
            bg: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
            text: 'text-white',
            outline:
                'border-blue-600 text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30',
        },
        delete: {
            bg: 'bg-red-600 hover:bg-red-700 active:bg-red-800',
            text: 'text-white',
            outline:
                'border-red-600 text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30',
        },
        archive: {
            bg: 'bg-gray-600 hover:bg-gray-700 active:bg-gray-800',
            text: 'text-white',
            outline:
                'border-gray-600 text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-950/30',
        },
    },

    // Surface colors
    surfaces: {
        card: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800',
        elevated:
            'bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800',
        hover: 'hover:bg-slate-50 dark:hover:bg-slate-800/50',
        active: 'bg-slate-100 dark:bg-slate-800',
    },
};

/**
 * Get status color classes
 */
export function getStatusColor(status: string) {
    const normalized = status.toLowerCase();
    return (
        semanticColors.status[
            normalized as keyof typeof semanticColors.status
        ] || semanticColors.status.open
    );
}

/**
 * Get priority color classes
 */
export function getPriorityColor(priority: 'high' | 'medium' | 'low') {
    return semanticColors.priority[priority] || semanticColors.priority.low;
}

/**
 * Get action color classes
 */
export function getActionColor(
    action: 'create' | 'update' | 'delete' | 'archive',
) {
    return semanticColors.actions[action] || semanticColors.actions.create;
}
