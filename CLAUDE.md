# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AppDesk is a Laravel 12 + Inertia.js + React 19 ticket management system for technical service requests, featuring multi-visit workflow, status tracking, and real-time updates.

## Development Commands

### Development Environment
```bash
# Run full dev environment (server + queue + vite)
composer run dev

# Run with SSR support
composer run dev:ssr

# Setup from scratch
composer run setup
```

### Frontend Commands
```bash
# Development with hot reload
npm run dev

# Production build
npm run build

# SSR build
npm run build:ssr

# Linting and formatting
npm run lint        # Auto-fix linting issues
npm run format      # Format code with Prettier
npm run format:check  # Check formatting without fixing
npm run types       # Type check without emitting
```

### Backend Commands
```bash
# Run Laravel server only
php artisan serve

# Database operations
php artisan migrate:fresh --seed
php artisan migrate
php artisan db:seed

# Testing
php artisan test                              # Run all tests
php artisan test tests/Feature/TicketTest.php # Run specific file
php artisan test --filter=TestName            # Run specific test

# Code quality
vendor/bin/pint --dirty  # Format PHP code (dirty files only)
vendor/bin/pint          # Format all PHP code

# Debugging
php artisan optimize:clear  # Clear all caches
php artisan route:list      # List all routes
php artisan tinker          # Interactive REPL
php artisan pail            # Tail logs in terminal
php artisan queue:listen --tries=1  # Run queue worker

# File storage
php artisan storage:link  # Create symbolic link for public storage
```

## Architecture Overview

### Backend Structure (Laravel 12)

**Core Models:**
- `Ticket` - Main ticket entity with soft deletes, JSON `visit_schedules` field for multi-visit tracking
  - Relationships: `assignedTo`, `createdBy`, `assignedBy`, `statusHistories`, `activities`, `parts`, `assignments`
- `TicketActivity` - Activity log entries for tickets (belongs to `Ticket` and `User`)
- `TicketStatusHistory` - Automatic status change tracking (created by `TicketObserver`)
- `TicketAssignment` - Track assignment history (who assigned, when, notes, is_active flag)
  - Relationships: `ticket`, `assignedTo`, `assignedBy`, `unassignedBy`
- `User` - User/engineer accounts
  - Relationships: `assignedTickets`, `createdTickets`, `ticketAssignments`
- `Part` - Parts used in tickets (belongs to `Ticket`)
- `Engineer`, `Province`, `Regency`, `SpecialPlace` - Supporting models

**Status Flow:**
Open → Need to Receive → In Progress → Resolved → Closed

**Important:** Closed tickets are immutable. Validate status before allowing modifications.

**Key Conventions:**
- **No Form Request classes** - Validation is inline in controllers using `$request->validate([...])`
- **Model casts** - Use `casts()` method (not `$casts` property)
- **Observers** - `TicketObserver` automatically creates status history on create/update, registered in `AppServiceProvider`
- **Eager loading** - Always eager load relationships to prevent N+1 queries
- **Query filtering** - Preserve filters with `.withQueryString()` on paginated results
- **File uploads** - Store in `storage/app/public/tickets/{type}`, use `Storage::disk('public')`
- **Excel exports** - Use Maatwebsite\Excel, see `app/Exports/TicketsExport.php`

### Frontend Structure (React 19 + TypeScript)

**Directory Layout:**
```
resources/js/
├── pages/           # Inertia pages (lowercase folders/files)
├── components/
│   └── ui/          # shadcn/ui components
├── layouts/
│   ├── app-layout.tsx   # Main layout with sidebar
│   └── auth-layout.tsx  # Auth pages layout
├── hooks/           # Custom React hooks
├── lib/             # Utilities (cn, utils)
├── types/           # TypeScript type definitions
├── actions/         # Server actions
└── wayfinder/       # Type-safe routing (auto-generated)
```

**Path Aliases:**
- `@/` maps to `resources/js/`
- Use for all imports: `@/components/ui/button`, `@/hooks/use-appearance`

**UI Library:**
- shadcn/ui components in `resources/js/components/ui/`
- Tailwind CSS v4 (use `@import "tailwindcss";` in CSS, not `@tailwind`)
- Lucide React icons
- Dark/light mode via `useAppearance()` hook

**Key Patterns:**
- Pages use lowercase folder/file names: `tickets/index.tsx`, `tickets/timeline.tsx`
- All pages wrap in `AppLayout` component
- Use `<Link>` and `router.visit()` from Inertia (never `<a>` tags)
- Forms use `useForm()` or `<Form>` from Inertia
- Display errors with `InputError` component
- Loading states use `<Skeleton>` component
- Status badges use consistent color scheme (see copilot-instructions.md)

### Inertia.js Integration

**Type-safe routing with Wayfinder:**
```typescript
import { route } from '@/wayfinder'
route('tickets.show', { ticket: 123 })  // Generates /tickets/123
```

**Form handling:**
```typescript
const { data, setData, post, processing, errors } = useForm({
  ticket_number: '',
  company: '',
})

const submit = (e) => {
  e.preventDefault()
  post('/tickets')  // Errors handled automatically
}
```

**Real-time filtering:**
```typescript
router.get(
  '/tickets',
  { search: value, status },
  { preserveState: true, replace: true }
)
```

### Build System

**Vite Configuration:**
- React with React Compiler (babel-plugin-react-compiler)
- Tailwind CSS v4 via `@tailwindcss/vite`
- Laravel Vite Plugin for asset management
- Wayfinder plugin for type-safe routing
- SSR support enabled (`resources/js/ssr.tsx`)

**TypeScript:**
- Strict mode enabled
- Path alias: `@/*` → `resources/js/*`
- Target: ESNext
- Module resolution: bundler

## Ticket System Specifics

### Multi-Visit Workflow

Tickets can require multiple engineer visits. The `visit_schedules` JSON field stores:
```json
[
  {
    "visit_number": 1,
    "scheduled_date": "2024-10-30",
    "status": "completed",
    "completed_at": "2024-10-30 14:30:00"
  },
  {
    "visit_number": 2,
    "scheduled_date": "2024-11-05",
    "status": "pending"
  }
]
```

**Key Fields:**
- `current_visit` - Current visit number (integer)
- `needs_revisit` - Boolean flag
- `visit_schedules` - JSON array of visit data

### File Handling

Three file types per ticket:
- `ct_bad_part` - Photo of faulty component
- `ct_good_part` - Photo of replacement component
- `bap_file` - BAP document (PDF/image)

**Storage location:** `storage/app/public/tickets/{type}/`
**Download route:** `/tickets/{ticket}/download/{fileType}`

### Activity Logging

Use `TicketActivity` model to log significant events:
```php
TicketActivity::create([
    'ticket_id' => $ticket->id,
    'user_id' => auth()->id(),
    'activity_type' => 'completed', // created, updated, completed, revisit, assigned, unassigned, reassigned
    'title' => 'Visit completed',
    'description' => 'Additional notes...',
    'activity_time' => now(),
]);
```

### Ticket Assignment System

**Overview:**
Track ticket assignments with full history. Each assignment records who assigned the ticket, when, and optional notes. Previous assignments are deactivated (not deleted) to maintain history.

**Key Features:**
- Single active assignment per ticket
- Assignment history tracking
- Bulk assignment support
- Reassignment with reason tracking
- Automatic activity logging

**Routes:**
- `GET /assignments` - Assignment dashboard with workload statistics
- `POST /assignments` - Assign ticket to engineer
- `DELETE /assignments/{ticket}` - Unassign ticket
- `POST /assignments/bulk` - Bulk assign multiple tickets
- `POST /assignments/{ticket}/reassign` - Reassign to different engineer
- `GET /assignments/{ticket}/history` - View assignment history

**Usage Example:**
```php
// Create assignment (automatically deactivates previous)
TicketAssignment::create([
    'ticket_id' => $ticket->id,
    'assigned_to' => $engineerId,
    'assigned_by' => auth()->id(),
    'assigned_at' => now(),
    'notes' => 'Urgent - customer escalation',
    'is_active' => true,
]);

// Also update the ticket's assigned_to field
$ticket->update([
    'assigned_to' => $engineerId,
    'assigned_at' => now(),
    'assigned_by' => auth()->id(),
]);
```

**Model Scopes:**
- `active()` - Get only active assignments
- `forEngineer($id)` - Filter by engineer

### Analytics Dashboard

**Overview:**
Comprehensive analytics system with interactive visualizations, real-time updates, and multiple data views.

**API Endpoints:**
- `GET /analytics` - Main analytics page (Inertia)
- `GET /analytics/overview` - KPIs and system metrics
- `GET /analytics/trends` - Time-series trends (hourly/daily/weekly/monthly)
- `GET /analytics/performance` - SLA compliance, response times, revisit rates
- `GET /analytics/realtime` - Real-time activity feed and today's stats
- `GET /analytics/tickets` - Ticket analytics with status trends and response time distribution
- `GET /analytics/engineers` - Engineer workload, completion rates, utilization
- `GET /analytics/parts` - Parts usage trends and distribution
- `GET /analytics/comparisons` - Period-over-period comparisons
- `GET /analytics/export` - Export data as JSON

**Key Metrics:**
- Total/active/closed ticket counts with trends
- Average resolution time in hours
- SLA compliance rate (24-hour threshold)
- Engineer completion rates and workload
- Parts usage statistics
- Response time distribution (bucketed: 0-1h, 1-4h, 4-24h, 1-3d, 3d+)
- Status funnel visualization
- Top companies by ticket volume

**Query Parameters:**
- `start_date` - Filter start date
- `end_date` - Filter end date
- `period` - Grouping: hourly, daily, weekly, monthly
- `group_by` - Alias for period in some endpoints
- `months` - Number of months to look back (default: 12)
- `hours` - Hours for realtime data (default: 24)

**Frontend Features:**
- Date range presets (Today, Last 7 Days, Last 30 Days, etc.)
- Auto-refresh toggle (60-second intervals)
- Interactive charts using Recharts library
- 6 tabbed views: Overview, Tickets, Engineers, Performance, Parts, Comparison
- Export functionality for analytics data
- Loading states with skeleton UI

## Testing

**Framework:** Pest v4

**Test Locations:**
- `tests/Feature/` - Feature tests
- `tests/Browser/` - Browser tests

**Common Patterns:**
```php
beforeEach(function () {
    $this->user = User::factory()->create();
});

it('can create a ticket', function () {
    actingAs($this->user)
        ->post(route('tickets.store'), [...])
        ->assertRedirect();
});

// Inertia assertions
->assertInertia(fn ($page) =>
    $page->component('tickets/index')
        ->has('tickets.data', 10)
);
```

## Authentication

**Laravel Fortify:**
- Config: `config/fortify.php`
- Features: registration, reset-password, email-verification, two-factor-authentication
- Custom views registered in `FortifyServiceProvider`
- Auth routes: handled by Fortify
- Middleware: `auth`, `verified`

## Code Quality Standards

### Single Responsibility Principle

Controllers should orchestrate, not implement business logic. Extract complex operations into:
- **Services** - Complex business logic, reusable operations
- **Actions** - Single-purpose operations (see `app/Actions/`)
- **Observers** - Model event handling
- **Exports** - Data export logic

**Example:**
```php
// Bad - controller doing too much
public function complete(Request $request, Ticket $ticket) {
    $validated = $request->validate(['notes' => 'string']);
    $visitSchedules = $ticket->visit_schedules ?? [];
    $visitSchedules[$ticket->current_visit]['status'] = 'completed';
    // ... 20 more lines
}

// Good - delegated to service
public function complete(CompleteTicketRequest $request, Ticket $ticket) {
    $this->ticketVisitService->completeCurrentVisit($ticket, $request->validated());
    return redirect()->route('tickets.timeline', $ticket)
        ->with('success', 'Visit completed successfully.');
}
```

### Eloquent Best Practices

- Always use Eloquent over Query Builder (`DB::`)
- Prefer collections over arrays for data manipulation
- Use mass assignment with relationships
- Define model scopes for common queries
- Eager load to prevent N+1 queries

### Frontend Best Practices

- Always type component props and state
- Use existing shadcn/ui components before creating new ones
- Use `cn()` utility for className merging
- Implement skeleton loading states
- Handle errors with `InputError` or `AlertError` components
- Follow gradient header pattern for page titles

## Environment Setup

**Requirements:**
- PHP 8.2+
- Node.js (for Vite)
- Composer
- Database (SQLite/MySQL/PostgreSQL)

**First-time setup:**
```bash
composer run setup  # Installs deps, generates key, runs migrations, builds assets
php artisan storage:link  # Required for file uploads
```

## Common Pitfalls

1. **Tailwind v4 syntax** - Use `@import "tailwindcss";` in CSS files (not `@tailwind`)
2. **Route model binding** - Controllers use implicit binding (`Ticket $ticket`)
3. **Status validation** - Always check ticket status before modifications (closed = immutable)
4. **Frontend changes not showing** - Run `npm run build` or restart `composer run dev`
5. **N+1 queries** - Eager load relationships in index/show actions
6. **Filter preservation** - Use `.withQueryString()` on paginated results
7. **Observer duplication** - Check `TicketObserver` before adding status history logic

## SSR Support

SSR is configured but optional. To enable:
```bash
npm run build:ssr
composer run dev:ssr  # Runs server + queue + ssr + pail
```

Entry point: `resources/js/ssr.tsx`

## Additional Resources

For detailed UI patterns, component usage examples, and frontend conventions, see `.github/copilot-instructions.md` (comprehensive but very long).