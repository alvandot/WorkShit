import { Button } from '@/components/ui/button';
import { TableHead } from '@/components/ui/table';
import { type SortDirection } from '@/hooks/use-sortable-table';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

interface SortableTableHeadProps<T> {
    column: keyof T;
    label: string;
    sortDirection: SortDirection;
    onSort: (column: keyof T) => void;
    className?: string;
    align?: 'left' | 'center' | 'right';
}

export function SortableTableHead<T>({
    column,
    label,
    sortDirection,
    onSort,
    className,
    align = 'left',
}: SortableTableHeadProps<T>) {
    const alignClasses = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
    };

    return (
        <TableHead className={cn(className)}>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort(column)}
                className={cn(
                    '-ml-3 h-8 gap-1 font-semibold hover:bg-transparent data-[state=open]:bg-accent',
                    alignClasses[align],
                )}
            >
                {label}
                {sortDirection === null && <ArrowUpDown className="size-3.5 text-muted-foreground" />}
                {sortDirection === 'asc' && <ArrowUp className="size-3.5" />}
                {sortDirection === 'desc' && <ArrowDown className="size-3.5" />}
            </Button>
        </TableHead>
    );
}
