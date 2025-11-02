import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { AlertCircle, Calendar as CalendarIcon, Filter, X } from 'lucide-react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

interface Engineer {
    id: number;
    name: string;
}

interface AdvancedFiltersProps {
    onFilterChange: (filters: FilterState) => void;
    engineers?: Engineer[];
    className?: string;
}

export interface FilterState {
    statuses: string[];
    dateRange?: DateRange;
    assignedTo?: string;
    priority?: string;
    search?: string;
}

const availableStatuses = [
    {
        label: 'Open',
        color: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600',
    },
    {
        label: 'Need to Receive',
        color: 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600',
    },
    {
        label: 'In Progress',
        color: 'bg-purple-500 hover:bg-purple-600 text-white border-purple-600',
    },
    {
        label: 'Finish',
        color: 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600',
    },
    {
        label: 'Closed',
        color: 'bg-slate-500 hover:bg-slate-600 text-white border-slate-600',
    },
];

export function AdvancedFilters({
    onFilterChange,
    engineers = [],
    className,
}: AdvancedFiltersProps) {
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [assignedTo, setAssignedTo] = useState<string>('all');
    const [priority, setPriority] = useState<string>('all');

    const hasActiveFilters =
        selectedStatuses.length > 0 ||
        dateRange !== undefined ||
        assignedTo !== 'all' ||
        priority !== 'all';

    const toggleStatus = (statusLabel: string) => {
        const newStatuses = selectedStatuses.includes(statusLabel)
            ? selectedStatuses.filter((s) => s !== statusLabel)
            : [...selectedStatuses, statusLabel];

        setSelectedStatuses(newStatuses);
        emitFilters({ statuses: newStatuses });
    };

    const removeStatus = (status: string) => {
        const newStatuses = selectedStatuses.filter((s) => s !== status);
        setSelectedStatuses(newStatuses);
        emitFilters({ statuses: newStatuses });
    };

    const handleDateRangeChange = (range: DateRange | undefined) => {
        setDateRange(range);
        emitFilters({ dateRange: range });
    };

    const handleAssignedToChange = (value: string) => {
        setAssignedTo(value);
        emitFilters({ assignedTo: value });
    };

    const handlePriorityChange = (value: string) => {
        setPriority(value);
        emitFilters({ priority: value });
    };

    const clearAllFilters = () => {
        setSelectedStatuses([]);
        setDateRange(undefined);
        setAssignedTo('all');
        setPriority('all');
        emitFilters({
            statuses: [],
            dateRange: undefined,
            assignedTo: 'all',
            priority: 'all',
        });
    };

    const emitFilters = (partialFilters: Partial<FilterState>) => {
        onFilterChange({
            statuses: selectedStatuses,
            dateRange,
            assignedTo,
            priority,
            ...partialFilters,
        });
    };

    return (
        <Card className={cn('sticky top-4', className)}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Filter className="size-4" />
                    Advanced Filters
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Status Filter - Multi-select */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="flex flex-wrap gap-2">
                        {availableStatuses.map((status) => {
                            const isSelected = selectedStatuses.includes(
                                status.label,
                            );
                            return (
                                <Badge
                                    key={status.label}
                                    className={cn(
                                        'cursor-pointer transition-all hover:scale-105',
                                        isSelected
                                            ? status.color
                                            : 'border-2 bg-background hover:bg-muted',
                                    )}
                                    variant={isSelected ? 'default' : 'outline'}
                                    onClick={() => toggleStatus(status.label)}
                                >
                                    {status.label}
                                    {isSelected && (
                                        <X className="ml-1 size-3" />
                                    )}
                                </Badge>
                            );
                        })}
                    </div>
                </div>

                {/* Date Range Picker */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Date Range</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                            >
                                <CalendarIcon className="mr-2 size-4" />
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, 'PPP')} -{' '}
                                            {format(dateRange.to, 'PPP')}
                                        </>
                                    ) : (
                                        format(dateRange.from, 'PPP')
                                    )
                                ) : (
                                    <span className="text-muted-foreground">
                                        Pick a date range
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="range"
                                selected={dateRange}
                                onSelect={handleDateRangeChange}
                                numberOfMonths={2}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Assigned To Filter */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Assigned To</Label>
                    <Select
                        value={assignedTo}
                        onValueChange={handleAssignedToChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All engineers" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Engineers</SelectItem>
                            <SelectItem value="unassigned">
                                Unassigned
                            </SelectItem>
                            {engineers.map((eng) => (
                                <SelectItem
                                    key={eng.id}
                                    value={eng.id.toString()}
                                >
                                    {eng.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Priority Filter */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Priority</Label>
                    <RadioGroup
                        value={priority}
                        onValueChange={handlePriorityChange}
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="all" />
                            <Label
                                htmlFor="all"
                                className="cursor-pointer font-normal"
                            >
                                All
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="high" id="high" />
                            <Label
                                htmlFor="high"
                                className="flex cursor-pointer items-center gap-2 font-normal"
                            >
                                <AlertCircle className="size-4 text-red-500" />
                                High Priority
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="medium" />
                            <Label
                                htmlFor="medium"
                                className="flex cursor-pointer items-center gap-2 font-normal"
                            >
                                <AlertCircle className="size-4 text-orange-500" />
                                Medium Priority
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="low" id="low" />
                            <Label
                                htmlFor="low"
                                className="flex cursor-pointer items-center gap-2 font-normal"
                            >
                                <AlertCircle className="size-4 text-blue-500" />
                                Low Priority
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="space-y-2 border-t pt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                Active Filters
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAllFilters}
                                className="h-auto p-0 text-xs hover:text-destructive"
                            >
                                Clear All
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {selectedStatuses.map((status) => (
                                <Badge
                                    key={status}
                                    variant="secondary"
                                    className="text-xs"
                                >
                                    {status}
                                    <X
                                        className="ml-1 size-3 cursor-pointer hover:text-destructive"
                                        onClick={() => removeStatus(status)}
                                    />
                                </Badge>
                            ))}
                            {dateRange && (
                                <Badge variant="secondary" className="text-xs">
                                    Date Range
                                    <X
                                        className="ml-1 size-3 cursor-pointer hover:text-destructive"
                                        onClick={() =>
                                            handleDateRangeChange(undefined)
                                        }
                                    />
                                </Badge>
                            )}
                            {assignedTo !== 'all' && (
                                <Badge variant="secondary" className="text-xs">
                                    Assigned:{' '}
                                    {assignedTo === 'unassigned'
                                        ? 'Unassigned'
                                        : engineers.find(
                                              (e) =>
                                                  e.id.toString() ===
                                                  assignedTo,
                                          )?.name}
                                    <X
                                        className="ml-1 size-3 cursor-pointer hover:text-destructive"
                                        onClick={() =>
                                            handleAssignedToChange('all')
                                        }
                                    />
                                </Badge>
                            )}
                            {priority !== 'all' && (
                                <Badge variant="secondary" className="text-xs">
                                    Priority: {priority}
                                    <X
                                        className="ml-1 size-3 cursor-pointer hover:text-destructive"
                                        onClick={() =>
                                            handlePriorityChange('all')
                                        }
                                    />
                                </Badge>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
