import { useCallback, useMemo, useState } from 'react';

export interface UseBulkSelectionReturn<T> {
    selectedItems: Set<T>;
    isSelected: (item: T) => boolean;
    toggleItem: (item: T) => void;
    toggleAll: () => void;
    clearSelection: () => void;
    selectAll: () => void;
    deselectAll: () => void;
    selectedCount: number;
    isAllSelected: boolean;
    isSomeSelected: boolean;
}

export function useBulkSelection<T extends { id: string | number }>(
    items: T[],
    getItemId: (item: T) => string | number = (item: T) => item.id,
): UseBulkSelectionReturn<string | number> {
    const [selectedItems, setSelectedItems] = useState<Set<string | number>>(
        new Set(),
    );

    const itemIds = useMemo(() => items.map(getItemId), [items, getItemId]);

    const isSelected = useCallback(
        (itemId: string | number) => selectedItems.has(itemId),
        [selectedItems],
    );

    const toggleItem = useCallback((itemId: string | number) => {
        setSelectedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    }, []);

    const toggleAll = useCallback(() => {
        setSelectedItems((prev) => {
            if (prev.size === itemIds.length) {
                return new Set();
            }
            return new Set(itemIds);
        });
    }, [itemIds]);

    const selectAll = useCallback(() => {
        setSelectedItems(new Set(itemIds));
    }, [itemIds]);

    const deselectAll = useCallback(() => {
        setSelectedItems(new Set());
    }, []);

    const clearSelection = deselectAll;

    const selectedCount = selectedItems.size;
    const isAllSelected = selectedCount > 0 && selectedCount === itemIds.length;
    const isSomeSelected = selectedCount > 0 && selectedCount < itemIds.length;

    return {
        selectedItems,
        isSelected,
        toggleItem,
        toggleAll,
        clearSelection,
        selectAll,
        deselectAll,
        selectedCount,
        isAllSelected,
        isSomeSelected,
    };
}
