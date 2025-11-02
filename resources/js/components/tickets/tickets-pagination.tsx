import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { memo } from 'react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface TicketsPaginationProps {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

export const TicketsPagination = memo(
    ({
        current_page,
        last_page,
        per_page,
        total,
        links,
    }: TicketsPaginationProps) => {
        if (last_page <= 1) return null;

        return (
            <div className="flex items-center justify-between rounded-xl border bg-card p-5 shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">
                    Showing{' '}
                    <span className="font-bold text-foreground">
                        {(current_page - 1) * per_page + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-bold text-foreground">
                        {Math.min(current_page * per_page, total)}
                    </span>{' '}
                    of{' '}
                    <span className="font-bold text-foreground">{total}</span>{' '}
                    entries
                </p>

                <div className="flex items-center gap-2">
                    {links.map((link, index) => {
                        if (link.label === '&laquo; Previous') {
                            return (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url && router.get(link.url)
                                    }
                                    className="shadow-sm transition-shadow hover:shadow-md"
                                >
                                    Previous
                                </Button>
                            );
                        }

                        if (link.label === 'Next &raquo;') {
                            return (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url && router.get(link.url)
                                    }
                                    className="shadow-sm transition-shadow hover:shadow-md"
                                >
                                    Next
                                </Button>
                            );
                        }

                        return (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                className={
                                    link.active
                                        ? 'shadow-lg'
                                        : 'shadow-sm transition-shadow hover:shadow-md'
                                }
                            >
                                {link.label}
                            </Button>
                        );
                    })}
                </div>
            </div>
        );
    },
);
