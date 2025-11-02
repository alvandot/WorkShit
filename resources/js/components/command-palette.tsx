import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { router } from '@inertiajs/react';
import {
    Building2,
    FileText,
    Home,
    LayoutDashboard,
    MapPin,
    Moon,
    Palette,
    Plus,
    Settings,
    Sun,
    Ticket as TicketIcon,
    User,
    UserPlus,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export function CommandPalette() {
    const [open, setOpen] = useState(false);

    // Keyboard shortcut: Cmd+K or Ctrl+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                <CommandGroup heading="Quick Actions">
                    <CommandItem
                        onSelect={() =>
                            runCommand(() => {
                                router.visit('/tickets/create');
                            })
                        }
                    >
                        <Plus className="mr-2 size-4" />
                        <span>Create New Ticket</span>
                        <kbd className="ml-auto inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground select-none">
                            N
                        </kbd>
                    </CommandItem>
                    <CommandItem
                        onSelect={() =>
                            runCommand(() => {
                                router.visit('/engineers/create');
                            })
                        }
                    >
                        <UserPlus className="mr-2 size-4" />
                        <span>Add Engineer</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() =>
                            runCommand(() => {
                                router.visit('/special-places/create');
                            })
                        }
                    >
                        <MapPin className="mr-2 size-4" />
                        <span>Add Special Place</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Navigation">
                    <CommandItem
                        onSelect={() =>
                            runCommand(() => {
                                router.visit('/dashboard');
                            })
                        }
                    >
                        <Home className="mr-2 size-4" />
                        <span>Dashboard</span>
                        <kbd className="ml-auto inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground select-none">
                            G D
                        </kbd>
                    </CommandItem>
                    <CommandItem
                        onSelect={() =>
                            runCommand(() => {
                                router.visit('/tickets');
                            })
                        }
                    >
                        <TicketIcon className="mr-2 size-4" />
                        <span>Tickets</span>
                        <kbd className="ml-auto inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground select-none">
                            G T
                        </kbd>
                    </CommandItem>
                    <CommandItem
                        onSelect={() =>
                            runCommand(() => {
                                router.visit('/engineers');
                            })
                        }
                    >
                        <Users className="mr-2 size-4" />
                        <span>Engineers</span>
                        <kbd className="ml-auto inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground select-none">
                            G E
                        </kbd>
                    </CommandItem>
                    <CommandItem
                        onSelect={() =>
                            runCommand(() => {
                                router.visit('/special-places');
                            })
                        }
                    >
                        <Building2 className="mr-2 size-4" />
                        <span>Special Places</span>
                        <kbd className="ml-auto inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground select-none">
                            G S
                        </kbd>
                    </CommandItem>
                    <CommandItem
                        onSelect={() =>
                            runCommand(() => {
                                router.visit('/analytics');
                            })
                        }
                    >
                        <LayoutDashboard className="mr-2 size-4" />
                        <span>Analytics</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() =>
                            runCommand(() => {
                                router.visit('/assignments');
                            })
                        }
                    >
                        <FileText className="mr-2 size-4" />
                        <span>Assignments</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Settings">
                    <CommandItem
                        onSelect={() =>
                            runCommand(() => {
                                router.visit('/settings/profile');
                            })
                        }
                    >
                        <User className="mr-2 size-4" />
                        <span>Profile Settings</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() =>
                            runCommand(() => {
                                router.visit('/settings/appearance');
                            })
                        }
                    >
                        <Palette className="mr-2 size-4" />
                        <span>Appearance</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() =>
                            runCommand(() => {
                                router.visit('/settings');
                            })
                        }
                    >
                        <Settings className="mr-2 size-4" />
                        <span>All Settings</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Theme">
                    <CommandItem
                        onSelect={() =>
                            runCommand(() =>
                                document.documentElement.classList.add('dark'),
                            )
                        }
                    >
                        <Moon className="mr-2 size-4" />
                        <span>Dark Mode</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() =>
                            runCommand(() =>
                                document.documentElement.classList.remove(
                                    'dark',
                                ),
                            )
                        }
                    >
                        <Sun className="mr-2 size-4" />
                        <span>Light Mode</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}

// Keyboard shortcuts listener for global navigation
export function useKeyboardShortcuts() {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only trigger if not in input/textarea
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement
            ) {
                return;
            }

            // Check for 'g' key combinations
            if (e.key === 'g') {
                const nextKey = new Promise<string>((resolve) => {
                    const handler = (e: KeyboardEvent) => {
                        resolve(e.key);
                        document.removeEventListener('keydown', handler);
                    };
                    document.addEventListener('keydown', handler);
                    setTimeout(() => {
                        document.removeEventListener('keydown', handler);
                    }, 1000);
                });

                nextKey.then((key) => {
                    switch (key) {
                        case 'd':
                            router.visit('/dashboard');
                            break;
                        case 't':
                            router.visit('/tickets');
                            break;
                        case 'e':
                            router.visit('/engineers');
                            break;
                        case 's':
                            router.visit('/special-places');
                            break;
                    }
                });
            }

            // 'n' for new ticket
            if (e.key === 'n' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                router.visit('/tickets/create');
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);
}
