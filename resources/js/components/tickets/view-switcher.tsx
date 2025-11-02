import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Columns3, List, Table } from 'lucide-react';

export type ViewMode = 'table' | 'grid' | 'kanban';

interface ViewSwitcherProps {
    currentView: ViewMode;
    onViewChange: (view: ViewMode) => void;
    className?: string;
}

const views = [
    {
        id: 'table' as ViewMode,
        label: 'Table View',
        icon: Table,
        description: 'View tickets in a detailed table',
    },
    {
        id: 'grid' as ViewMode,
        label: 'Grid View',
        icon: List,
        description: 'View tickets in a grid layout',
    },
    {
        id: 'kanban' as ViewMode,
        label: 'Kanban Board',
        icon: Columns3,
        description: 'View tickets in a kanban board',
    },
];

export function ViewSwitcher({
    currentView,
    onViewChange,
    className,
}: ViewSwitcherProps) {
    return (
        <TooltipProvider>
            <div
                className={cn(
                    'inline-flex items-center rounded-lg border bg-card p-1',
                    className,
                )}
            >
                {views.map((view) => {
                    const Icon = view.icon;
                    const isActive = currentView === view.id;

                    return (
                        <Tooltip key={view.id}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={isActive ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => onViewChange(view.id)}
                                    className={cn(
                                        'gap-2 transition-all',
                                        !isActive && 'hover:bg-muted',
                                    )}
                                >
                                    <Icon className="size-4" />
                                    <span className="hidden sm:inline">
                                        {view.label}
                                    </span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{view.description}</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </div>
        </TooltipProvider>
    );
}
