# AppDesk - Ticket Management System

AppDesk is a Laravel 12 + Inertia.js + React 19 ticket management system for tracking technical service requests with multi-visit workflow support.

## Architecture Overview

**Core Domain**: Ticket lifecycle management with status tracking, activity timeline, multi-visit scheduling, and file attachments.

**Tech Stack**:
- Backend: Laravel 12 + Fortify (auth) + Maatwebsite Excel (exports)
- Frontend: React 19 + Inertia.js v2 + shadcn/ui + Tailwind CSS v4
- Testing: Pest v4 with browser testing support
- Build: Vite 7 with React Compiler + Wayfinder for type-safe routing

**Key Models & Relationships**:
- `Ticket`: Core entity with soft deletes, tracks multi-visit workflow via `visit_schedules` JSON column
  - `belongsTo` User (assignedTo, createdBy)
  - `hasMany` TicketStatusHistory, TicketActivity
- Status flow: Open → Need to Receive → In Progress → Resolved → Closed
- Multi-visit support: up to 3 visits per ticket, tracked in `visit_schedules` array

**Critical Business Rules**:
1. **Closed tickets are immutable** - cannot add activities, complete, or revisit closed tickets
2. **TicketObserver** auto-creates status history entries on create/update
3. **Visit workflow**: pending_schedule → scheduled → in_progress → completed
4. **File uploads**: stored in `storage/app/public/tickets/{type}` (ct_bad_part, ct_good_part, bap_file)

## Project-Specific Conventions

### Frontend (React + TypeScript)
- **Component structure**: `resources/js/pages/` for Inertia pages (lowercase folder names like `tickets/index.tsx`)
- **Path aliases**: Use `@/` prefix for imports (`@/components`, `@/lib/utils`, `@/hooks`)
- **UI components**: Located in `resources/js/components/ui/` (shadcn/ui), use existing components before creating new ones
- **Theme system**: Custom dark/light mode via `use-appearance` hook, initialized in `app.tsx`
- **Page naming**: Lowercase folders + lowercase file names (e.g., `tickets/show.tsx` → Inertia component `tickets/show`)

#### UI Component Library (shadcn/ui)
**Available Components** (in `resources/js/components/ui/`):
- Form controls: `button`, `input`, `select`, `textarea`, `checkbox`, `switch`, `label`
- Layout: `card`, `table`, `separator`, `tabs`, `collapsible`, `scroll-area`
- Feedback: `alert`, `badge`, `skeleton`, `spinner`, `tooltip`, `dialog`, `sheet`
- Navigation: `dropdown-menu`, `navigation-menu`, `sidebar`, `breadcrumb`
- Special: `avatar`, `icon`, `input-otp`, `toggle`, `toggle-group`

**Component Usage Patterns**:
```tsx
// Always use cn() utility for className merging
import { cn } from '@/lib/utils'
<div className={cn('base-classes', conditionalClass && 'conditional-classes')} />

// Button with variants (from class-variance-authority)
import { Button } from '@/components/ui/button'
<Button variant="outline" size="sm">Click me</Button>
// Variants: default, destructive, outline, secondary, ghost, link
// Sizes: default, sm, lg, icon

// Table pattern (see tickets/index.tsx)
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
<Table>
  <TableHeader>
    <TableRow><TableHead>Header</TableHead></TableRow>
  </TableHeader>
  <TableBody>
    <TableRow><TableCell>Data</TableCell></TableRow>
  </TableBody>
</Table>

// Dialog/Modal pattern
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// Dropdown menu pattern (for action menus)
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
```

#### Custom Hooks
- **`useAppearance()`**: Theme management (light/dark/system)
  - Returns `{ appearance, updateAppearance }`
  - Syncs with localStorage and cookies for SSR
  - Auto-responds to system theme changes
- **`useMobile()`**: Responsive breakpoint detection
- **`useClipboard()`**: Copy to clipboard functionality
- **`useInitials()`**: Generate user initials from name

#### Common UI Patterns

**Status Badge Colors** (consistent across app):
```tsx
const statusColors: Record<string, string> = {
  Open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'Need to Receive': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'In Progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  Resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
}
```

**Gradient Headers** (consistent design pattern):
```tsx
<div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/20">
  <div className="space-y-2">
    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
      PAGE TITLE
    </h1>
    <p className="text-muted-foreground text-sm">Subtitle description</p>
  </div>
</div>
```

**Empty States**:
```tsx
<TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
  <div className="flex flex-col items-center gap-3">
    <div className="p-4 rounded-full bg-muted">
      <Icon className="size-8 text-muted-foreground" />
    </div>
    <p className="text-lg font-medium">No items found</p>
    <p className="text-sm">Helpful message here</p>
  </div>
</TableCell>
```

**Icon Integration** (lucide-react):
```tsx
import { Plus, MoreVertical, Eye, Pencil, Trash, Download, Filter } from 'lucide-react'
// Use size-4 for inline icons, size-8 for feature icons
<Button><Plus className="mr-2 size-4" />Create</Button>
```

#### Inertia.js Patterns

**Page Component Structure**:
```tsx
import { Head, Link, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import type { PageProps } from '@/types'

interface Props extends PageProps {
  tickets: PaginatedTickets
  filters: { search?: string; status?: string }
}

export default function TicketsIndex({ tickets, filters }: Props) {
  return (
    <AppLayout>
      <Head title="Page Title" />
      {/* Page content */}
    </AppLayout>
  )
}
```

**Navigation & Links**:
```tsx
// Use Link for internal navigation (preserves Inertia state)
import { Link } from '@inertiajs/react'
<Link href="/tickets/create">Create Ticket</Link>

// Use router for programmatic navigation
import { router } from '@inertiajs/react'
router.visit('/tickets/123')
router.get('/tickets', { search: 'value' }, { preserveState: true, replace: true })
router.delete('/tickets/123')
```

**Real-time Search/Filter Pattern** (from tickets/index.tsx):
```tsx
const [search, setSearch] = useState(filters.search || '')
const [status, setStatus] = useState(filters.status || 'all')

const handleSearch = (value: string) => {
  setSearch(value)
  router.get(
    '/tickets',
    { search: value, status },
    { preserveState: true, replace: true }
  )
}
```

**Table Row Click Pattern**:
```tsx
<TableRow
  className="cursor-pointer hover:bg-primary/5 transition-colors"
  onClick={() => router.visit(`/tickets/${ticket.id}/timeline`)}
>
  {/* Prevent event bubbling for action buttons */}
  <TableCell onClick={(e) => e.stopPropagation()}>
    <DropdownMenu>{/* Actions */}</DropdownMenu>
  </TableCell>
</TableRow>
```

**Pagination Pattern**:
```tsx
// Backend returns Laravel pagination with links array
{tickets.links.map((link, index) => (
  <Button
    variant={link.active ? 'default' : 'outline'}
    disabled={!link.url}
    onClick={() => link.url && router.get(link.url)}
  >
    {link.label}
  </Button>
))}
```

#### Layout System
- **AppLayout**: Main layout wrapper with sidebar (at `layouts/app-layout.tsx`)
- **Breadcrumbs**: Pass as prop to AppLayout: `<AppLayout breadcrumbs={[...]}>`
- **AppShell**: Base shell with `variant="header"` or `variant="sidebar"`

#### TypeScript Conventions
- Define interfaces for props at top of file
- Use `PageProps` type from `@/types` for shared Inertia props
- Type pagination data as `PaginatedTickets` or similar
- Always type component props and state

#### Form Validation & Error Handling

**Inertia Form Pattern** (Recommended - using `useForm` hook):
```tsx
import { useForm } from '@inertiajs/react'
import InputError from '@/components/input-error'

const { data, setData, post, processing, errors } = useForm({
  ticket_number: '',
  company: '',
  problem: '',
})

const submit: FormEventHandler = (e) => {
  e.preventDefault()
  post('/tickets') // Automatically handles errors from backend validation
}

// In JSX:
<Input
  value={data.ticket_number}
  onChange={(e) => setData('ticket_number', e.target.value)}
  required
/>
<InputError message={errors.ticket_number} />
```

**Inertia Form Component Pattern** (Alternative - newer API):
```tsx
import { Form } from '@inertiajs/react'

<Form action="/login" method="post" resetOnSuccess={['password']}>
  {({ processing, errors, recentlySuccessful }) => (
    <>
      <Input type="email" name="email" required />
      <InputError message={errors.email} />
      
      <Button type="submit" disabled={processing}>
        {processing && <Spinner />}
        Log in
      </Button>
      
      {recentlySuccessful && <p className="text-sm text-green-600">Saved!</p>}
    </>
  )}
</Form>
```

**Error Display Patterns**:
```tsx
// Individual field error (use InputError component)
<InputError message={errors.field_name} />

// Multiple errors (use AlertError component)
import AlertError from '@/components/alert-error'
<AlertError 
  errors={Object.values(errors)} 
  title="Please fix the following errors:" 
/>

// Flash messages from backend
const { flash } = usePage<SharedData>().props
{flash?.success && <div className="text-green-600">{flash.success}</div>}
{flash?.error && <div className="text-red-600">{flash.error}</div>}
```

**Backend Validation Error Response**:
```php
// Controller returns errors automatically to Inertia
return back()->withErrors(['error' => 'Cannot complete a closed ticket.']);

// Redirect with success message
return redirect()->route('tickets.index')->with('success', 'Ticket created successfully.');
```

#### Loading & Skeleton States

**Processing State** (button disabled during form submission):
```tsx
const { processing } = useForm()

<Button type="submit" disabled={processing}>
  {processing ? 'Creating...' : 'Create Ticket'}
</Button>

// With spinner
<Button disabled={processing}>
  {processing && <Spinner />}
  Log in
</Button>
```

**Skeleton Loading Pattern**:
```tsx
import { Skeleton } from '@/components/ui/skeleton'

// Card skeleton
<Card>
  <CardHeader>
    <Skeleton className="h-6 w-1/3" />
  </CardHeader>
  <CardContent className="space-y-3">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-4 w-4/6" />
  </CardContent>
</Card>

// Table skeleton
<TableRow>
  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
</TableRow>

// Menu skeleton (sidebar)
import { SidebarMenuSkeleton } from '@/components/ui/sidebar'
<SidebarMenuSkeleton showIcon />
```

**Conditional Loading**:
```tsx
{isLoading ? (
  <Skeleton className="h-8 w-full" />
) : (
  <div>{content}</div>
)}
```

#### Animation & Transition Patterns

**Headless UI Transitions** (for success messages, modals):
```tsx
import { Transition } from '@headlessui/react'

<Transition
  show={recentlySuccessful}
  enter="transition ease-in-out"
  enterFrom="opacity-0"
  leave="transition ease-in-out"
  leaveTo="opacity-0"
>
  <p className="text-sm text-neutral-600">Saved</p>
</Transition>
```

**Tailwind Transition Classes** (for hover, focus states):
```tsx
// Button hover
<Button className="shadow-sm hover:shadow-md transition-shadow">
  Click me
</Button>

// Table row hover
<TableRow className="cursor-pointer hover:bg-primary/5 transition-colors">

// Smooth color transitions
<div className="transition-colors duration-300 ease-out hover:bg-accent">

// Multiple properties
<div className="transition-[color,box-shadow] duration-200">
```

**CSS Starting State** (initial page load animations - Tailwind v4):
```tsx
// Fade in on page load
<div className="opacity-100 transition-opacity duration-750 starting:opacity-0">

// Slide up on page load
<div className="translate-y-0 opacity-100 transition-all duration-750 starting:translate-y-6 starting:opacity-0">

// With delay
<g className="translate-y-0 opacity-100 transition-all delay-300 duration-750 starting:translate-y-4 starting:opacity-0">
```

**Common Animation Classes**:
```tsx
// Pulse animation (for skeletons)
<div className="animate-pulse" />

// Spin animation (for loaders)
<div className="animate-spin" />

// Smooth entrance
<div className="animate-in fade-in slide-in-from-bottom-4 duration-300" />
```

#### Form Validation Rules (Backend)

**Inline Validation Pattern** (no Form Request classes):
```php
$validated = $request->validate([
  'ticket_number' => 'required|string|unique:tickets,ticket_number',
  'company' => 'required|string|max:255',
  'problem' => 'required|string',
  'status' => 'required|in:Open,Need to Receive,In Progress,Resolved,Closed',
  'assigned_to' => 'nullable|exists:users,id',
  'schedule' => 'nullable|date',
  'ct_bad_part' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
]);
```

### Backend (Laravel)
- **No Form Request classes**: Validation is inline in controllers (see `TicketController::store()`)
- **Inline validation pattern**: Use `$request->validate([...])` directly in controller methods
- **Model casts**: Use `casts()` method, not `$casts` property (Laravel 12 convention)
- **Observers**: Registered in `AppServiceProvider::boot()` - check before creating duplicate logic
- **JSON columns**: `visit_schedules` stores complex visit data as array, accessed directly via Eloquent
- **Eloquent over Query Builder**: Always prefer Eloquent models and relationships over raw Query Builder (`DB::`) or SQL queries
- **Collections over arrays**: Use Laravel collections for data manipulation instead of plain arrays when working with model data
- **Mass assignment**: Use mass assignment with relationships (e.g., `$category->article()->create()`) instead of manually setting properties
- **Single Responsibility Principle**: Each method/class should have one clear responsibility - extract complex logic into dedicated services

#### Single Responsibility Principle

Controllers should orchestrate application flow, not implement business logic. Extract validation, logging, data transformation, and business rules into dedicated services or actions.

**Bad** (controller doing too much):
```php
public function update(Request $request): RedirectResponse
{
    // Validation logic
    $validated = $request->validate([
        'title' => 'required|max:255',
        'events' => 'required|array:date,type'
    ]);

    // Logging logic
    foreach ($request->events as $event) {
        $date = Carbon::parse($event['date'])->toString();
        Log::info('Update event ' . $date . ' :: ' . $event['type']);
    }

    // Business logic
    $this->event->updateGeneralEvent($validated);

    return back();
}
```

**Good** (single responsibility):
```php
public function update(UpdateEventRequest $request): RedirectResponse
{
    $this->eventLogService->logEvents($request->events);
    
    $this->eventService->updateGeneralEvent($request->validated());

    return back()->with('success', 'Event updated successfully.');
}
```

**Real-world AppDesk examples**:
```php
// Bad - TicketController doing too much
public function complete(Request $request, Ticket $ticket): RedirectResponse
{
    $validated = $request->validate(['notes' => 'nullable|string']);
    
    $visitSchedules = $ticket->visit_schedules ?? [];
    $visitSchedules[$ticket->current_visit]['status'] = 'completed';
    $visitSchedules[$ticket->current_visit]['completed_at'] = now();
    
    $ticket->update([
        'visit_schedules' => $visitSchedules,
        'status' => 'Resolved'
    ]);
    
    TicketActivity::create([
        'ticket_id' => $ticket->id,
        'user_id' => $request->user()->id,
        'activity_type' => 'completed',
        'title' => 'Visit completed',
        'description' => $validated['notes'],
    ]);
    
    return redirect()->route('tickets.timeline', $ticket);
}

// Good - Using service/action classes
public function complete(CompleteTicketRequest $request, Ticket $ticket): RedirectResponse
{
    $this->ticketVisitService->completeCurrentVisit($ticket, $request->validated());
    
    return redirect()->route('tickets.timeline', $ticket)
        ->with('success', 'Visit completed successfully.');
}
```

**When to extract into services**:
- Complex business logic (e.g., visit scheduling, status transitions)
- Reusable operations (e.g., activity logging, file handling)
- Third-party integrations (e.g., Excel exports, email notifications)
- Data transformations (e.g., formatting for frontend, aggregations)

#### Methods Should Do Just One Thing

A function should do just one thing and do it well. Complex conditions and multiple responsibilities within a single method make code hard to read, test, and maintain. Break down complex methods into smaller, focused methods with descriptive names.

**Bad** (method doing too much with complex conditions):
```php
public function getFullNameAttribute(): string
{
    if (auth()->user() && auth()->user()->hasRole('client') && auth()->user()->isVerified()) {
        return 'Mr. ' . $this->first_name . ' ' . $this->middle_name . ' ' . $this->last_name;
    } else {
        return $this->first_name[0] . '. ' . $this->last_name;
    }
}
```

**Good** (each method has one clear purpose):
```php
public function getFullNameAttribute(): string
{
    return $this->isVerifiedClient() ? $this->getFullNameLong() : $this->getFullNameShort();
}

public function isVerifiedClient(): bool
{
    return auth()->user() && auth()->user()->hasRole('client') && auth()->user()->isVerified();
}

public function getFullNameLong(): string
{
    return 'Mr. ' . $this->first_name . ' ' . $this->middle_name . ' ' . $this->last_name;
}

public function getFullNameShort(): string
{
    return $this->first_name[0] . '. ' . $this->last_name;
}
```

**Real-world AppDesk examples**:
```php
// Bad - Complex method with multiple responsibilities
public function canPerformAction(Ticket $ticket, string $action): bool
{
    if ($ticket->status === 'Closed') {
        return false;
    }
    
    if ($action === 'complete' && $ticket->current_visit > 3) {
        return false;
    }
    
    if ($action === 'revisit' && $ticket->status !== 'Resolved') {
        return false;
    }
    
    if (auth()->user()->id !== $ticket->assigned_to && !auth()->user()->hasRole('admin')) {
        return false;
    }
    
    return true;
}

// Good - Each method does one thing
public function canPerformAction(Ticket $ticket, string $action): bool
{
    return !$this->isTicketClosed($ticket)
        && $this->canPerformSpecificAction($ticket, $action)
        && $this->userHasPermission($ticket);
}

protected function isTicketClosed(Ticket $ticket): bool
{
    return $ticket->status === 'Closed';
}

protected function canPerformSpecificAction(Ticket $ticket, string $action): bool
{
    return match($action) {
        'complete' => $this->canCompleteVisit($ticket),
        'revisit' => $this->canRevisitTicket($ticket),
        default => true,
    };
}

protected function canCompleteVisit(Ticket $ticket): bool
{
    return $ticket->current_visit <= 3;
}

protected function canRevisitTicket(Ticket $ticket): bool
{
    return $ticket->status === 'Resolved';
}

protected function userHasPermission(Ticket $ticket): bool
{
    return auth()->user()->id === $ticket->assigned_to 
        || auth()->user()->hasRole('admin');
}
```

**Benefits**:
- ✅ Easier to test (each method can be tested independently)
- ✅ More readable (descriptive method names explain what they do)
- ✅ Easier to debug (smaller methods = easier to pinpoint issues)
- ✅ Better reusability (focused methods can be reused elsewhere)
- ✅ Simplified maintenance (changes to one aspect don't affect others)

#### Fat Models, Skinny Controllers

Put all database-related logic into Eloquent models or dedicated query classes. Controllers should orchestrate the flow, not build complex queries. This makes code more reusable, testable, and maintainable.

**Bad** (controller with complex query logic):
```php
public function index()
{
    $clients = Client::verified()
        ->with(['orders' => function ($q) {
            $q->where('created_at', '>', Carbon::today()->subWeek());
        }])
        ->get();

    return view('index', ['clients' => $clients]);
}
```

**Good** (query logic in model):
```php
public function index()
{
    return view('index', ['clients' => $this->client->getWithNewOrders()]);
}

// In Client model
class Client extends Model
{
    public function getWithNewOrders(): Collection
    {
        return $this->verified()
            ->with(['orders' => function ($q) {
                $q->where('created_at', '>', Carbon::today()->subWeek());
            }])
            ->get();
    }
}
```

**Real-world AppDesk examples**:
```php
// Bad - TicketController with complex queries
public function index(Request $request)
{
    $query = Ticket::query()->with(['assignedTo', 'createdBy']);
    
    if ($request->has('search') && $request->search) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('ticket_number', 'like', "%{$search}%")
              ->orWhere('company', 'like', "%{$search}%")
              ->orWhere('problem', 'like', "%{$search}%");
        });
    }
    
    if ($request->status && $request->status !== 'all') {
        if ($request->status === 'open') {
            $query->where('status', '!=', 'Closed');
        } else {
            $query->where('status', $request->status);
        }
    }
    
    $tickets = $query->latest()->paginate(10)->withQueryString();
    
    return Inertia::render('tickets/index', ['tickets' => $tickets]);
}

// Good - Query logic in model using scopes and methods
public function index(Request $request)
{
    $tickets = Ticket::query()
        ->search($request->search)
        ->filterByStatus($request->status)
        ->withRelations()
        ->latest()
        ->paginate(10)
        ->withQueryString();
    
    return Inertia::render('tickets/index', ['tickets' => $tickets]);
}

// In Ticket model
public function scopeSearch(Builder $query, ?string $search): void
{
    if (!$search) {
        return;
    }
    
    $query->where(function ($q) use ($search) {
        $q->where('ticket_number', 'like', "%{$search}%")
          ->orWhere('company', 'like', "%{$search}%")
          ->orWhere('problem', 'like', "%{$search}%");
    });
}

public function scopeFilterByStatus(Builder $query, ?string $status): void
{
    if (!$status || $status === 'all') {
        return;
    }
    
    if ($status === 'open') {
        $query->where('status', '!=', 'Closed');
    } else {
        $query->where('status', $status);
    }
}

public function scopeWithRelations(Builder $query): void
{
    $query->with(['assignedTo', 'createdBy']);
}
```

**Alternative: Query Builder Classes** (for very complex queries):
```php
// In app/Queries/TicketQuery.php
class TicketQuery
{
    public function __construct(private Ticket $ticket) {}
    
    public function getFilteredTickets(?string $search, ?string $status): LengthAwarePaginator
    {
        return $this->ticket->query()
            ->search($search)
            ->filterByStatus($status)
            ->withRelations()
            ->latest()
            ->paginate(10)
            ->withQueryString();
    }
}

// In controller
public function index(Request $request, TicketQuery $ticketQuery)
{
    $tickets = $ticketQuery->getFilteredTickets($request->search, $request->status);
    
    return Inertia::render('tickets/index', ['tickets' => $tickets]);
}
```

**Benefits**:
- ✅ **Reusability**: Query logic dapat digunakan di berbagai controller
- ✅ **Testability**: Model methods dan scopes mudah di-unit test
- ✅ **Readability**: Controller tetap clean dan fokus pada orchestration
- ✅ **Maintainability**: Perubahan query logic hanya di satu tempat
- ✅ **Discoverability**: Developer lain mudah menemukan query logic di model

#### Don't Repeat Yourself (DRY)

Reuse code when you can. Single Responsibility Principle helps you avoid duplication. Also, reuse Blade/React components, use Eloquent scopes, extract repeated logic into methods, and leverage Laravel's built-in features.

**Bad** (duplicated query logic):
```php
public function getActive()
{
    return $this->where('verified', 1)->whereNotNull('deleted_at')->get();
}

public function getArticles()
{
    return $this->whereHas('user', function ($q) {
            $q->where('verified', 1)->whereNotNull('deleted_at');
        })->get();
}
```

**Good** (reusable scope):
```php
public function scopeActive($q)
{
    return $q->where('verified', true)->whereNotNull('deleted_at');
}

public function getActive(): Collection
{
    return $this->active()->get();
}

public function getArticles(): Collection
{
    return $this->whereHas('user', function ($q) {
            $q->active();
        })->get();
}
```

**Real-world AppDesk examples**:
```php
// Bad - Repeated status checking logic
public function canComplete(Ticket $ticket): bool
{
    if ($ticket->status === 'Closed') {
        return false;
    }
    return $ticket->current_visit <= 3;
}

public function canRevisit(Ticket $ticket): bool
{
    if ($ticket->status === 'Closed') {
        return false;
    }
    return $ticket->status === 'Resolved';
}

public function canAddActivity(Ticket $ticket): bool
{
    if ($ticket->status === 'Closed') {
        return false;
    }
    return true;
}

// Good - Extract common logic into reusable method
public function canComplete(Ticket $ticket): bool
{
    return !$this->isClosed($ticket) && $ticket->current_visit <= 3;
}

public function canRevisit(Ticket $ticket): bool
{
    return !$this->isClosed($ticket) && $ticket->status === 'Resolved';
}

public function canAddActivity(Ticket $ticket): bool
{
    return !$this->isClosed($ticket);
}

protected function isClosed(Ticket $ticket): bool
{
    return $ticket->status === 'Closed';
}

// Even better - Use Eloquent scope
// In Ticket model
public function scopeNotClosed(Builder $query): void
{
    $query->where('status', '!=', 'Closed');
}

public function scopeResolved(Builder $query): void
{
    $query->where('status', 'Resolved');
}

// Usage in queries
$openTickets = Ticket::notClosed()->get();
$resolvedTickets = Ticket::resolved()->get();
```

**Frontend DRY Example (React Components)**:
```tsx
// Bad - Repeated status badge logic
// In tickets/index.tsx
<span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
  {ticket.status}
</span>

// In tickets/show.tsx
<span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
  {ticket.status}
</span>

// Good - Reusable StatusBadge component
// In components/status-badge.tsx
export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'In Progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    Resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  }
  
  return <Badge className={colors[status]}>{status}</Badge>
}

// Usage
<StatusBadge status={ticket.status} />
```

**Common Patterns to DRY**:
- ✅ **Query scopes** for repeated where conditions
- ✅ **Model methods** for common calculations or checks
- ✅ **Service classes** for repeated business logic
- ✅ **Blade/React components** for repeated UI patterns
- ✅ **Traits** for shared model behavior
- ✅ **Helper functions** for repeated transformations
- ✅ **Form Requests** for repeated validation rules

**Benefits**:
- ✅ **Maintainability**: Changes in one place affect all usages
- ✅ **Consistency**: Same logic produces same results everywhere
- ✅ **Testability**: Test once, confidence everywhere
- ✅ **Readability**: Descriptive names make code self-documenting
- ✅ **Reduced bugs**: Less duplication = fewer places for bugs to hide

### Testing with Pest
- **Import style**: Use `function Pest\Laravel\{actingAs, get, post};` for test helpers
- **beforeEach pattern**: Set up authenticated user in `beforeEach(fn() => $this->user = ...)` 
- **Inertia assertions**: `$response->assertInertia(fn($page) => $page->component('tickets/index'))`
- **Database assertions**: Use `assertDatabaseHas()` for data verification
- **Test coverage**: Each controller action has corresponding test in `tests/Feature/`

### Routing & Navigation
- **Route file**: `routes/web.php` for main routes, `routes/settings.php` for settings group
- **Named routes**: Always use `route('tickets.index')` in redirects, not hardcoded paths
- **Resource routes**: Ticket uses standard resourceful routing + custom actions (timeline, export, complete, revisit)
- **Frontend navigation**: Use Inertia `<Link>` component, not `<a>` tags

## Development Workflows

### Running the Application
```bash
# Single dev command (concurrent server + queue + vite)
composer run dev

# Production build
npm run build && php artisan serve

# SSR mode (if needed)
composer run dev:ssr
```

### Testing Workflow
```bash
# Run specific test file
php artisan test tests/Feature/TicketTest.php

# Run with filter
php artisan test --filter="can create a new ticket"

# All tests
php artisan test

# Run with coverage
php artisan test --coverage

# Parallel testing (faster)
php artisan test --parallel
```

### Code Quality
```bash
# Auto-fix PHP formatting (REQUIRED before committing)
vendor/bin/pint --dirty

# Frontend linting & formatting
npm run lint       # ESLint with auto-fix
npm run format     # Prettier
npm run types      # TypeScript check
```

### Database & Models
```bash
# Always use artisan make commands
php artisan make:model Ticket -mfs  # model + migration + factory + seeder

# Fresh database with seed data
php artisan migrate:fresh --seed

# Rollback last migration
php artisan migrate:rollback

# Check migration status
php artisan migrate:status
```

### Common Development Tasks

**Creating a New Feature**:
```bash
# 1. Create model with migration, factory, seeder
php artisan make:model Feature -mfs

# 2. Create controller
php artisan make:controller FeatureController --resource

# 3. Create test
php artisan make:test FeatureTest --pest

# 4. Run migration
php artisan migrate

# 5. Run tests
php artisan test --filter=FeatureTest
```

**Debugging Tips**:
```bash
# Clear all caches
php artisan optimize:clear

# View routes
php artisan route:list

# Tinker (interactive PHP REPL)
php artisan tinker

# Check logs
php artisan pail  # Real-time log viewer (dev only)
tail -f storage/logs/laravel.log  # Traditional approach
```

**Frontend Development**:
```bash
# Install new UI component from shadcn
npx shadcn@latest add dialog

# Check TypeScript errors
npm run types

# Format all code
npm run format

# Build for production
npm run build
```

## Common Patterns

### Controller Action Pattern (Ticket Timeline Example)
```php
public function timeline(Ticket $ticket): Response
{
    $ticket->load(['assignedTo', 'createdBy', 'activities.user']);
    
    // Transform data for frontend expectations
    $ticketData = $ticket->toArray();
    $ticketData['assigned_to_user'] = $ticket->assignedTo;
    $ticketData['activities'] = $ticket->activities->map(fn($a) => [
        ...$a->toArray(),
        'user' => $a->user
    ]);
    
    return Inertia::render('tickets/timeline', ['ticket' => $ticketData]);
}
```

### Preventing Operations on Closed Tickets
```php
if ($ticket->status === 'Closed') {
    return back()->withErrors(['error' => 'Cannot {action} a closed ticket.']);
}
```

### Working with Visit Schedules
```php
$visitSchedules = $ticket->visit_schedules ?? [];
$visitSchedules[$ticket->current_visit]['status'] = 'completed';
$ticket->update(['visit_schedules' => $visitSchedules]);
```

### Advanced Patterns

#### Eloquent Best Practices

**Prefer Eloquent Over Query Builder and Raw SQL**:
Eloquent provides readable, maintainable code with powerful built-in features like soft deletes, events, scopes, and relationships. Always use Eloquent models over `DB::` queries or raw SQL.

**Bad** (using raw SQL):
```php
DB::select('SELECT * FROM articles WHERE EXISTS (SELECT * FROM users WHERE articles.user_id = users.id AND EXISTS (SELECT * FROM profiles WHERE profiles.user_id = users.id) AND users.deleted_at IS NULL) AND verified = ? AND active = ? ORDER BY created_at DESC', [1, 1]);
```

**Good** (using Eloquent with relationships and scopes):
```php
Article::has('user.profile')->verified()->latest()->get();
```

**Mass Assignment Pattern**:
Use mass assignment with model relationships instead of manually setting properties one by one. This is more concise, less error-prone, and follows Laravel conventions.

**Bad** (manual property assignment):
```php
$article = new Article;
$article->title = $request->title;
$article->content = $request->content;
$article->verified = $request->verified;
$article->category_id = $category->id;
$article->save();
```

**Good** (mass assignment with relationship):
```php
$category->article()->create($request->validated());
```

**For updating existing models**:
```php
// Bad
$ticket->ticket_number = $validated['ticket_number'];
$ticket->company = $validated['company'];
$ticket->problem = $validated['problem'];
$ticket->status = $validated['status'];
$ticket->save();

// Good
$ticket->update($validated);
```

**Collections Over Arrays**:
When working with model data, prefer Laravel collections over plain arrays for their powerful manipulation methods.

**Bad** (using arrays):
```php
$activeTickets = [];
foreach ($tickets as $ticket) {
    if ($ticket->status !== 'Closed') {
        $activeTickets[] = $ticket;
    }
}
```

**Good** (using collections):
```php
$activeTickets = $tickets->reject(fn($ticket) => $ticket->status === 'Closed');
```

**Real-world AppDesk examples**:
```php
// Use Eloquent relationships instead of manual joins
// Bad
$tickets = DB::table('tickets')
    ->join('users', 'tickets.assigned_to', '=', 'users.id')
    ->select('tickets.*', 'users.name as assigned_to_name')
    ->get();

// Good
$tickets = Ticket::with('assignedTo')->get();

// Use scopes for reusable query logic
// In Ticket model:
public function scopeActive(Builder $query): void
{
    $query->where('status', '!=', 'Closed');
}

// Usage:
$activeTickets = Ticket::active()->get();

// Use relationship creation for better code
// Bad
$activity = new TicketActivity;
$activity->ticket_id = $ticket->id;
$activity->user_id = $request->user()->id;
$activity->activity_type = $validated['activity_type'];
$activity->title = $validated['title'];
$activity->save();

// Good
$ticket->activities()->create([
    ...$validated,
    'user_id' => $request->user()->id,
    'visit_number' => $ticket->current_visit,
]);
```

#### Eager Loading with Constraints
```php
// Load only latest 5 activities per ticket
$tickets = Ticket::with(['activities' => fn($query) => $query->latest()->limit(5)])
    ->get();

// Load specific columns from relationships
$tickets = Ticket::with('assignedTo:id,name,email')->get();
```

#### Search & Filter Pattern
```php
$query = Ticket::query()->with(['assignedTo', 'createdBy']);

// Multi-column search
if ($request->has('search') && $request->search) {
    $search = $request->search;
    $query->where(function ($q) use ($search) {
        $q->where('ticket_number', 'like', "%{$search}%")
          ->orWhere('company', 'like', "%{$search}%")
          ->orWhere('problem', 'like', "%{$search}%");
    });
}

// Status filter with special handling
if ($request->status === 'open') {
    $query->where('status', '!=', 'Closed'); // "Open" = all except closed
} else {
    $query->where('status', $request->status);
}

// Preserve filters in pagination
$tickets = $query->latest()->paginate(10)->withQueryString();
```

#### Activity Logging Pattern
```php
public function addActivity(Request $request, Ticket $ticket)
{
    $validated = $request->validate([
        'activity_type' => 'required|in:received,on_the_way,arrived,start_working,completed',
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'activity_time' => 'required|date',
    ]);

    // Auto-update ticket status based on activity type
    $statusMap = [
        'received' => 'In Progress',
        'completed' => 'Resolved',
    ];

    $ticket->activities()->create([
        ...$validated,
        'user_id' => $request->user()->id,
        'visit_number' => $ticket->current_visit,
    ]);

    if (isset($statusMap[$validated['activity_type']])) {
        $ticket->update(['status' => $statusMap[$validated['activity_type']]]);
    }

    return back()->with('success', 'Activity added successfully.');
}
```

#### File Upload with Validation
```php
$validated = $request->validate([
    'ct_bad_part' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240', // 10MB
    'bap_file' => 'nullable|file|mimes:jpg,jpeg,png|max:20480', // 20MB, images only
]);

if ($request->hasFile('ct_bad_part')) {
    // Store and get path
    $path = $request->file('ct_bad_part')->store('tickets/ct_bad_parts', 'public');
    $validated['ct_bad_part'] = $path;
    
    // Optional: Delete old file
    if ($ticket->ct_bad_part) {
        Storage::disk('public')->delete($ticket->ct_bad_part);
    }
}

$ticket->update($validated);
```

#### Soft Delete Recovery
```php
// Include soft deleted records
$allTickets = Ticket::withTrashed()->get();

// Only soft deleted records
$deletedTickets = Ticket::onlyTrashed()->get();

// Restore soft deleted ticket
$ticket = Ticket::withTrashed()->find($id);
$ticket->restore();

// Permanently delete
$ticket->forceDelete();
```

#### Observer Pattern (Auto Status History)
```php
// In TicketObserver::created
public function created(Ticket $ticket): void
{
    TicketStatusHistory::create([
        'ticket_id' => $ticket->id,
        'old_status' => null,
        'new_status' => $ticket->status,
        'changed_by' => $ticket->created_by,
        'notes' => 'Ticket created',
    ]);
}

// In TicketObserver::updated
public function updated(Ticket $ticket): void
{
    if ($ticket->isDirty('status')) {
        TicketStatusHistory::create([
            'ticket_id' => $ticket->id,
            'old_status' => $ticket->getOriginal('status'),
            'new_status' => $ticket->status,
            'changed_by' => request()->user()?->id,
            'notes' => 'Status updated',
        ]);
    }
}
```

## Integration Points

### Excel Export with Maatwebsite\Excel

**Export Class Pattern** (see `app/Exports/TicketsExport.php`):
```php
namespace App\Exports;

use App\Models\Ticket;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class TicketsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        // Always eager load relationships to prevent N+1
        return Ticket::with(['assignedTo', 'createdBy'])->get();
    }

    public function headings(): array
    {
        return ['Ticket Number', 'Case ID', 'Company', 'Status', ...];
    }

    public function map($ticket): array
    {
        return [
            $ticket->ticket_number,
            $ticket->case_id,
            $ticket->company,
            $ticket->status,
            $ticket->assignedTo?->name, // Use null-safe operator
            $ticket->schedule?->format('Y-m-d H:i:s'), // Format dates
        ];
    }
}
```

**Controller Export Action**:
```php
use Maatwebsite\Excel\Facades\Excel;

public function export()
{
    return Excel::download(new TicketsExport, 'tickets-'.now()->format('Y-m-d').'.xlsx');
}
```

**Frontend Download Link**:
```tsx
<a href="/tickets/export">
  <Button variant="outline">
    <Download className="mr-2 size-4" />
    Export Excel
  </Button>
</a>
```

### Authentication with Laravel Fortify

**Configuration** (`config/fortify.php`):
- Features enabled: registration, reset passwords, update profile, update passwords, two-factor auth
- Custom views registered in `FortifyServiceProvider`
- Routes: `/login`, `/register`, `/two-factor-challenge`, `/user/two-factor-authentication`

**Two-Factor Authentication Flow**:
1. Enable 2FA: POST `/user/two-factor-authentication`
2. Show QR code: GET `/user/two-factor-qr-code`
3. Confirm with OTP: POST `/user/confirmed-two-factor-authentication`
4. Recovery codes: GET `/user/two-factor-recovery-codes`
5. Challenge login: POST `/two-factor-challenge`

**Middleware Pattern** (`routes/web.php`, `routes/settings.php`):
```php
// Require authentication + email verification
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('tickets', TicketController::class);
});

// Rate limiting for sensitive actions
Route::put('settings/password', [PasswordController::class, 'update'])
    ->middleware('throttle:6,1') // 6 attempts per minute
    ->name('user-password.update');
```

### File Storage & Downloads

**File Upload Pattern**:
```php
// Store with automatic path generation
$validated['ct_bad_part'] = $request->file('ct_bad_part')
    ->store('tickets/ct_bad_parts', 'public');

// Multiple file types
if ($request->hasFile('bap_file')) {
    $validated['bap_file'] = $request->file('bap_file')
        ->store('tickets/bap_files', 'public');
}
```

**File Download Pattern**:
```php
public function downloadFile(Ticket $ticket, string $fileType)
{
    // Validate file type
    if (!in_array($fileType, ['ct_bad_part', 'ct_good_part', 'bap_file'])) {
        abort(404, 'Invalid file type');
    }

    $filePath = $ticket->{$fileType};
    if (!$filePath) {
        abort(404, 'File not found');
    }

    $fullPath = storage_path('app/public/'.$filePath);
    $fileName = "CT_Bad_Part_{$ticket->ticket_number}_".basename($filePath);

    return response()->download($fullPath, $fileName);
}
```

**Storage Setup**:
- Public disk configured in `config/filesystems.php`
- Symlink: `php artisan storage:link` (links `storage/app/public` to `public/storage`)
- Access files: `asset('storage/tickets/file.pdf')`

### SSR Support (Optional)

**When to Enable SSR**:
- SEO requirements for public pages
- Faster initial page load
- Social media preview cards

**SSR Configuration**:
```bash
# Build SSR bundle
npm run build:ssr

# Start SSR server
php artisan inertia:start-ssr

# Run with SSR in dev
composer run dev:ssr
```

**SSR Considerations**:
- Server-side hooks: `useAppearance()` checks for window/document
- Initial theme: Synced via cookie for SSR hydration
- Build time: Slightly longer due to dual builds

## Gotchas & Important Notes

1. **Wayfinder**: Type-safe routing plugin generates route helpers, check `routes/` for generated TypeScript
2. **React Compiler**: Babel plugin enabled in Vite - avoid manual memoization, compiler handles it
3. **shadcn/ui**: Components in `components.json` with `@acme` registry configured - install via `npx shadcn@latest add`
4. **Tailwind v4**: Uses `@import` in CSS, not `@tailwind` directives - see `resources/css/app.css`
5. **Pagination**: Use `.withQueryString()` on paginated results to preserve filters
6. **N+1 Prevention**: Always eager load relationships in index/show actions (e.g., `with(['assignedTo', 'createdBy'])`)

---

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to enhance the user's satisfaction building Laravel applications.

## Foundational Context
This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.4.0
- inertiajs/inertia-laravel (INERTIA) - v2
- laravel/fortify (FORTIFY) - v1
- laravel/framework (LARAVEL) - v12
- laravel/prompts (PROMPTS) - v0
- laravel/wayfinder (WAYFINDER) - v0
- laravel/mcp (MCP) - v0
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- pestphp/pest (PEST) - v4
- phpunit/phpunit (PHPUNIT) - v12
- @inertiajs/react (INERTIA) - v2
- react (REACT) - v19
- tailwindcss (TAILWINDCSS) - v4
- @laravel/vite-plugin-wayfinder (WAYFINDER) - v0
- eslint (ESLINT) - v9
- prettier (PRETTIER) - v3


## Conventions
- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts
- Do not create verification scripts or tinker when tests cover that functionality and prove it works. Unit and feature tests are more important.

## Application Structure & Architecture
- Stick to existing directory structure - don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling
- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Replies
- Be concise in your explanations - focus on what's important rather than explaining obvious details.

## Documentation Files
- You must only create documentation files if explicitly requested by the user.


=== boost rules ===

## Laravel Boost
- Laravel Boost is an MCP server that comes with powerful tools designed specifically for this application. Use them.

## Artisan
- Use the `list-artisan-commands` tool when you need to call an Artisan command to double check the available parameters.

## URLs
- Whenever you share a project URL with the user you should use the `get-absolute-url` tool to ensure you're using the correct scheme, domain / IP, and port.

## Tinker / Debugging
- You should use the `tinker` tool when you need to execute PHP to debug code or query Eloquent models directly.
- Use the `database-query` tool when you only need to read from the database.

## Reading Browser Logs With the `browser-logs` Tool
- You can read browser logs, errors, and exceptions using the `browser-logs` tool from Boost.
- Only recent browser logs will be useful - ignore old logs.

## Searching Documentation (Critically Important)
- Boost comes with a powerful `search-docs` tool you should use before any other approaches. This tool automatically passes a list of installed packages and their versions to the remote Boost API, so it returns only version-specific documentation specific for the user's circumstance. You should pass an array of packages to filter on if you know you need docs for particular packages.
- The 'search-docs' tool is perfect for all Laravel related packages, including Laravel, Inertia, Livewire, Filament, Tailwind, Pest, Nova, Nightwatch, etc.
- You must use this tool to search for Laravel-ecosystem documentation before falling back to other approaches.
- Search the documentation before making code changes to ensure we are taking the correct approach.
- Use multiple, broad, simple, topic based queries to start. For example: `['rate limiting', 'routing rate limiting', 'routing']`.
- Do not add package names to queries - package information is already shared. For example, use `test resource table`, not `filament 4 test resource table`.

### Available Search Syntax
- You can and should pass multiple queries at once. The most relevant results will be returned first.

1. Simple Word Searches with auto-stemming - query=authentication - finds 'authenticate' and 'auth'
2. Multiple Words (AND Logic) - query=rate limit - finds knowledge containing both "rate" AND "limit"
3. Quoted Phrases (Exact Position) - query="infinite scroll" - Words must be adjacent and in that order
4. Mixed Queries - query=middleware "rate limit" - "middleware" AND exact phrase "rate limit"
5. Multiple Queries - queries=["authentication", "middleware"] - ANY of these terms


=== php rules ===

## PHP

- Always use curly braces for control structures, even if it has one line.

### Constructors
- Use PHP 8 constructor property promotion in `__construct()`.
    - <code-snippet>public function __construct(public GitHub $github) { }</code-snippet>
- Do not allow empty `__construct()` methods with zero parameters.

### Type Declarations
- Always use explicit return type declarations for methods and functions.
- Use appropriate PHP type hints for method parameters.

<code-snippet name="Explicit Return Types and Method Params" lang="php">
protected function isAccessible(User $user, ?string $path = null): bool
{
    ...
}
</code-snippet>

## Comments
- Prefer PHPDoc blocks over comments. Never use comments within the code itself unless there is something _very_ complex going on.

## PHPDoc Blocks
- Add useful array shape type definitions for arrays when appropriate.

## Enums
- Typically, keys in an Enum should be TitleCase. For example: `FavoritePerson`, `BestLake`, `Monthly`.


=== inertia-laravel/core rules ===

## Inertia Core

- Inertia.js components should be placed in the `resources/js/Pages` directory unless specified differently in the JS bundler (vite.config.js).
- Use `Inertia::render()` for server-side routing instead of traditional Blade views.
- Use `search-docs` for accurate guidance on all things Inertia.

<code-snippet lang="php" name="Inertia::render Example">
// routes/web.php example
Route::get('/users', function () {
    return Inertia::render('Users/Index', [
        'users' => User::all()
    ]);
});
</code-snippet>


=== inertia-laravel/v2 rules ===

## Inertia v2

- Make use of all Inertia features from v1 & v2. Check the documentation before making any changes to ensure we are taking the correct approach.

### Inertia v2 New Features
- Polling
- Prefetching
- Deferred props
- Infinite scrolling using merging props and `WhenVisible`
- Lazy loading data on scroll

### Deferred Props & Empty States
- When using deferred props on the frontend, you should add a nice empty state with pulsing / animated skeleton.

### Inertia Form General Guidance
- The recommended way to build forms when using Inertia is with the `<Form>` component - a useful example is below. Use `search-docs` with a query of `form component` for guidance.
- Forms can also be built using the `useForm` helper for more programmatic control, or to follow existing conventions. Use `search-docs` with a query of `useForm helper` for guidance.
- `resetOnError`, `resetOnSuccess`, and `setDefaultsOnSuccess` are available on the `<Form>` component. Use `search-docs` with a query of 'form component resetting' for guidance.


=== laravel/core rules ===

## Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using the `list-artisan-commands` tool.
- If you're creating a generic PHP class, use `artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Database
- Always use proper Eloquent relationship methods with return type hints. Prefer relationship methods over raw queries or manual joins.
- Use Eloquent models and relationships before suggesting raw database queries
- Avoid `DB::`; prefer `Model::query()`. Generate code that leverages Laravel's ORM capabilities rather than bypassing them.
- Generate code that prevents N+1 query problems by using eager loading.
- Use Laravel's query builder for very complex database operations.

### Model Creation
- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `list-artisan-commands` to check the available options to `php artisan make:model`.

### APIs & Eloquent Resources
- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

### Controllers & Validation
- Always create Form Request classes for validation rather than inline validation in controllers. Include both validation rules and custom error messages.
- Check sibling Form Requests to see if the application uses array or string based validation rules.

### Queues
- Use queued jobs for time-consuming operations with the `ShouldQueue` interface.

### Authentication & Authorization
- Use Laravel's built-in authentication and authorization features (gates, policies, Sanctum, etc.).

### URL Generation
- When generating links to other pages, prefer named routes and the `route()` function.

### Configuration
- Use environment variables only in configuration files - never use the `env()` function directly outside of config files. Always use `config('app.name')`, not `env('APP_NAME')`.

### Testing
- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] <name>` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

### Vite Error
- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.


=== laravel/v12 rules ===

## Laravel 12

- Use the `search-docs` tool to get version specific documentation.
- Since Laravel 11, Laravel has a new streamlined file structure which this project uses.

### Laravel 12 Structure
- No middleware files in `app/Http/Middleware/`.
- `bootstrap/app.php` is the file to register middleware, exceptions, and routing files.
- `bootstrap/providers.php` contains application specific service providers.
- **No app\Console\Kernel.php** - use `bootstrap/app.php` or `routes/console.php` for console configuration.
- **Commands auto-register** - files in `app/Console/Commands/` are automatically available and do not require manual registration.

### Database
- When modifying a column, the migration must include all of the attributes that were previously defined on the column. Otherwise, they will be dropped and lost.
- Laravel 11 allows limiting eagerly loaded records natively, without external packages: `$query->latest()->limit(10);`.

### Models
- Casts can and likely should be set in a `casts()` method on a model rather than the `$casts` property. Follow existing conventions from other models.


=== pint/core rules ===

## Laravel Pint Code Formatter

- You must run `vendor/bin/pint --dirty` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test`, simply run `vendor/bin/pint` to fix any formatting issues.


=== pest/core rules ===

## Pest

### Testing
- If you need to verify a feature is working, write or update a Unit / Feature test.

### Pest Tests
- All tests must be written using Pest. Use `php artisan make:test --pest <name>`.
- You must not remove any tests or test files from the tests directory without approval. These are not temporary or helper files - these are core to the application.
- Tests should test all of the happy paths, failure paths, and weird paths.
- Tests live in the `tests/Feature` and `tests/Unit` directories.
- Pest tests look and behave like this:
<code-snippet name="Basic Pest Test Example" lang="php">
it('is true', function () {
    expect(true)->toBeTrue();
});
</code-snippet>

### Running Tests
- Run the minimal number of tests using an appropriate filter before finalizing code edits.
- To run all tests: `php artisan test`.
- To run all tests in a file: `php artisan test tests/Feature/ExampleTest.php`.
- To filter on a particular test name: `php artisan test --filter=testName` (recommended after making a change to a related file).
- When the tests relating to your changes are passing, ask the user if they would like to run the entire test suite to ensure everything is still passing.

### Pest Assertions
- When asserting status codes on a response, use the specific method like `assertForbidden` and `assertNotFound` instead of using `assertStatus(403)` or similar, e.g.:
<code-snippet name="Pest Example Asserting postJson Response" lang="php">
it('returns all', function () {
    $response = $this->postJson('/api/docs', []);

    $response->assertSuccessful();
});
</code-snippet>

### Mocking
- Mocking can be very helpful when appropriate.
- When mocking, you can use the `Pest\Laravel\mock` Pest function, but always import it via `use function Pest\Laravel\mock;` before using it. Alternatively, you can use `$this->mock()` if existing tests do.
- You can also create partial mocks using the same import or self method.

### Datasets
- Use datasets in Pest to simplify tests which have a lot of duplicated data. This is often the case when testing validation rules, so consider going with this solution when writing tests for validation rules.

<code-snippet name="Pest Dataset Example" lang="php">
it('has emails', function (string $email) {
    expect($email)->not->toBeEmpty();
})->with([
    'james' => 'james@laravel.com',
    'taylor' => 'taylor@laravel.com',
]);
</code-snippet>


=== pest/v4 rules ===

## Pest 4

- Pest v4 is a huge upgrade to Pest and offers: browser testing, smoke testing, visual regression testing, test sharding, and faster type coverage.
- Browser testing is incredibly powerful and useful for this project.
- Browser tests should live in `tests/Browser/`.
- Use the `search-docs` tool for detailed guidance on utilizing these features.

### Browser Testing
- You can use Laravel features like `Event::fake()`, `assertAuthenticated()`, and model factories within Pest v4 browser tests, as well as `RefreshDatabase` (when needed) to ensure a clean state for each test.
- Interact with the page (click, type, scroll, select, submit, drag-and-drop, touch gestures, etc.) when appropriate to complete the test.
- If requested, test on multiple browsers (Chrome, Firefox, Safari).
- If requested, test on different devices and viewports (like iPhone 14 Pro, tablets, or custom breakpoints).
- Switch color schemes (light/dark mode) when appropriate.
- Take screenshots or pause tests for debugging when appropriate.

### Example Tests

<code-snippet name="Pest Browser Test Example" lang="php">
it('may reset the password', function () {
    Notification::fake();

    $this->actingAs(User::factory()->create());

    $page = visit('/sign-in'); // Visit on a real browser...

    $page->assertSee('Sign In')
        ->assertNoJavascriptErrors() // or ->assertNoConsoleLogs()
        ->click('Forgot Password?')
        ->fill('email', 'nuno@laravel.com')
        ->click('Send Reset Link')
        ->assertSee('We have emailed your password reset link!')

    Notification::assertSent(ResetPassword::class);
});
</code-snippet>

<code-snippet name="Pest Smoke Testing Example" lang="php">
$pages = visit(['/', '/about', '/contact']);

$pages->assertNoJavascriptErrors()->assertNoConsoleLogs();
</code-snippet>


=== inertia-react/core rules ===

## Inertia + React

- Use `router.visit()` or `<Link>` for navigation instead of traditional links.

<code-snippet name="Inertia Client Navigation" lang="react">

import { Link } from '@inertiajs/react'
<Link href="/">Home</Link>

</code-snippet>


=== inertia-react/v2/forms rules ===

## Inertia + React Forms

<code-snippet name="`<Form>` Component Example" lang="react">

import { Form } from '@inertiajs/react'

export default () => (
    <Form action="/users" method="post">
        {({
            errors,
            hasErrors,
            processing,
            wasSuccessful,
            recentlySuccessful,
            clearErrors,
            resetAndClearErrors,
            defaults
        }) => (
        <>
        <input type="text" name="name" />

        {errors.name && <div>{errors.name}</div>}

        <button type="submit" disabled={processing}>
            {processing ? 'Creating...' : 'Create User'}
        </button>

        {wasSuccessful && <div>User created successfully!</div>}
        </>
    )}
    </Form>
)

</code-snippet>


=== tailwindcss/core rules ===

## Tailwind Core

- Use Tailwind CSS classes to style HTML, check and use existing tailwind conventions within the project before writing your own.
- Offer to extract repeated patterns into components that match the project's conventions (i.e. Blade, JSX, Vue, etc..)
- Think through class placement, order, priority, and defaults - remove redundant classes, add classes to parent or child carefully to limit repetition, group elements logically
- You can use the `search-docs` tool to get exact examples from the official documentation when needed.

### Spacing
- When listing items, use gap utilities for spacing, don't use margins.

    <code-snippet name="Valid Flex Gap Spacing Example" lang="html">
        <div class="flex gap-8">
            <div>Superior</div>
            <div>Michigan</div>
            <div>Erie</div>
        </div>
    </code-snippet>


### Dark Mode
- If existing pages and components support dark mode, new pages and components must support dark mode in a similar way, typically using `dark:`.


=== tailwindcss/v4 rules ===

## Tailwind 4

- Always use Tailwind CSS v4 - do not use the deprecated utilities.
- `corePlugins` is not supported in Tailwind v4.
- In Tailwind v4, you import Tailwind using a regular CSS `@import` statement, not using the `@tailwind` directives used in v3:

<code-snippet name="Tailwind v4 Import Tailwind Diff" lang="diff">
   - @tailwind base;
   - @tailwind components;
   - @tailwind utilities;
   + @import "tailwindcss";
</code-snippet>


### Replaced Utilities
- Tailwind v4 removed deprecated utilities. Do not use the deprecated option - use the replacement.
- Opacity values are still numeric.

| Deprecated |	Replacement |
|------------+--------------|
| bg-opacity-* | bg-black/* |
| text-opacity-* | text-black/* |
| border-opacity-* | border-black/* |
| divide-opacity-* | divide-black/* |
| ring-opacity-* | ring-black/* |
| placeholder-opacity-* | placeholder-black/* |
| flex-shrink-* | shrink-* |
| flex-grow-* | grow-* |
| overflow-ellipsis | text-ellipsis |
| decoration-slice | box-decoration-slice |
| decoration-clone | box-decoration-clone |


=== tests rules ===

## Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `php artisan test` with a specific filename or filter.


=== laravel/fortify rules ===

## Laravel Fortify

Fortify is a headless authentication backend that provides authentication routes and controllers for Laravel applications.

**Before implementing any authentication features, use the `search-docs` tool to get the latest docs for that specific feature.**

### Configuration & Setup
- Check `config/fortify.php` to see what's enabled. Use `search-docs` for detailed information on specific features.
- Enable features by adding them to the `'features' => []` array: `Features::registration()`, `Features::resetPasswords()`, etc.
- To see the all Fortify registered routes, use the `list-routes` tool with the `only_vendor: true` and `action: "Fortify"` parameters.
- Fortify includes view routes by default (login, register). Set `'views' => false` in the configuration file to disable them if you're handling views yourself.

### Customization
- Views can be customized in `FortifyServiceProvider`'s `boot()` method using `Fortify::loginView()`, `Fortify::registerView()`, etc.
- Customize authentication logic with `Fortify::authenticateUsing()` for custom user retrieval / validation.
- Actions in `app/Actions/Fortify/` handle business logic (user creation, password reset, etc.). They're fully customizable, so you can modify them to change feature behavior.

## Available Features
- `Features::registration()` for user registration.
- `Features::emailVerification()` to verify new user emails.
- `Features::twoFactorAuthentication()` for 2FA with QR codes and recovery codes.
  - Add options: `['confirmPassword' => true, 'confirm' => true]` to require password confirmation and OTP confirmation before enabling 2FA.
- `Features::updateProfileInformation()` to let users update their profile.
- `Features::updatePasswords()` to let users change their passwords.
- `Features::resetPasswords()` for password reset via email.
</laravel-boost-guidelines>
