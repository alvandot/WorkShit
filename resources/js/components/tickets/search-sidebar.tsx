import { Input } from '@/components/ui/input';
import { memo } from 'react';

interface SearchSidebarProps {
    search: string;
    onSearch: (value: string) => void;
}

export const SearchSidebar = memo(
    ({ search, onSearch }: SearchSidebarProps) => {
        return (
            <div className="rounded-lg border bg-card p-4">
                <div className="mb-3">
                    <h3 className="text-sm font-medium text-foreground">
                        Search
                    </h3>
                </div>
                <Input
                    type="search"
                    placeholder="Search tickets..."
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full"
                />
            </div>
        );
    },
);
