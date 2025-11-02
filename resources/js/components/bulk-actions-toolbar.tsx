import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Tag, Trash2, UserPlus, X } from 'lucide-react';

interface BulkActionsToolbarProps {
    selectedCount: number;
    onClear: () => void;
    onAssign?: () => void;
    onChangeStatus?: () => void;
    onExport?: () => void;
    onDelete?: () => void;
    className?: string;
}

export function BulkActionsToolbar({
    selectedCount,
    onClear,
    onAssign,
    onChangeStatus,
    onExport,
    onDelete,
    className,
}: BulkActionsToolbarProps) {
    return (
        <AnimatePresence>
            {selectedCount > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                        'fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border bg-background px-5 py-3 shadow-lg ring-1 ring-black/5',
                        className,
                    )}
                >
                    <span className="text-sm font-medium">
                        <span className="tabular-nums">{selectedCount}</span>{' '}
                        {selectedCount === 1 ? 'item' : 'items'} selected
                    </span>

                    <Separator orientation="vertical" className="h-6" />

                    <div className="flex items-center gap-1">
                        {onAssign && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onAssign}
                                className="gap-2"
                            >
                                <UserPlus className="size-4" />
                                Assign
                            </Button>
                        )}

                        {onChangeStatus && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onChangeStatus}
                                className="gap-2"
                            >
                                <Tag className="size-4" />
                                Status
                            </Button>
                        )}

                        {onExport && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onExport}
                                className="gap-2"
                            >
                                <Download className="size-4" />
                                Export
                            </Button>
                        )}

                        {onDelete && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onDelete}
                                className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                            >
                                <Trash2 className="size-4" />
                                Delete
                            </Button>
                        )}
                    </div>

                    <Separator orientation="vertical" className="h-6" />

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClear}
                        className="gap-2"
                    >
                        <X className="size-4" />
                        Clear
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
