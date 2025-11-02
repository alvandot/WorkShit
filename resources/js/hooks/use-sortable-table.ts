import { useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig<T> {
    key: keyof T | null;
    direction: SortDirection;
}

export interface UseSortableTableReturn<T> {
    sortedData: T[];
    sortConfig: SortConfig<T>;
    requestSort: (key: keyof T) => void;
    getSortDirection: (key: keyof T) => SortDirection;
}

export function useSortableTable<T>(
    data: T[],
    defaultSort?: SortConfig<T>,
): UseSortableTableReturn<T> {
    const [sortConfig, setSortConfig] = useState<SortConfig<T>>(
        defaultSort || { key: null, direction: null },
    );

    const sortedData = useMemo(() => {
        const sortableData = [...data];

        if (sortConfig.key !== null && sortConfig.direction !== null) {
            sortableData.sort((a, b) => {
                const aValue = a[sortConfig.key!];
                const bValue = b[sortConfig.key!];

                // Handle null/undefined values
                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;

                // Compare values
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortableData;
    }, [data, sortConfig]);

    const requestSort = (key: keyof T) => {
        let direction: SortDirection = 'asc';

        if (sortConfig.key === key) {
            if (sortConfig.direction === 'asc') {
                direction = 'desc';
            } else if (sortConfig.direction === 'desc') {
                direction = null;
            }
        }

        setSortConfig({ key: direction === null ? null : key, direction });
    };

    const getSortDirection = (key: keyof T): SortDirection => {
        return sortConfig.key === key ? sortConfig.direction : null;
    };

    return {
        sortedData,
        sortConfig,
        requestSort,
        getSortDirection,
    };
}
