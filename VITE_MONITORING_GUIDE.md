# Vite Monitoring and Error Prevention Guide

## Overview
This document provides comprehensive monitoring strategies and solutions for Vite reload errors, module path issues, and dependency problems in the AppDesk Laravel + React application.

---

## 1. Automated Health Checks

### Running the Health Check Script

```bash
# Run comprehensive health check
npm run health-check

# Alternative: Direct execution
node scripts/vite-health-check.js
```

The script validates:
- ✅ TypeScript configuration (paths, module resolution, JSX)
- ✅ Vite configuration (plugins, hot reload)
- ✅ Package dependencies (versions, conflicts)
- ✅ Path aliases (existence, correctness)
- ✅ Import statements (missing extensions, broken paths)
- ✅ Node modules installation

### Schedule Regular Checks

**Recommended:**
- Before starting development: `npm run health-check`
- After installing/updating packages: `npm run health-check`
- When encountering HMR issues: `npm run health-check`
- Before deploying: `npm run health-check && npm run build`

---

## 2. Common Vite Reload Errors

### Error: "Failed to reload /resources/js/..."

**Symptoms:**
- Hot Module Replacement (HMR) stops working
- Browser shows "Hmm. We're having trouble finding that site."
- Console shows connection refused errors

**Causes:**
1. Vite dev server crashed
2. Port conflict (default: 5173)
3. Invalid module imports
4. Circular dependencies

**Solutions:**

```bash
# 1. Restart Vite dev server
npm run dev

# 2. Clear Vite cache
rm -rf node_modules/.vite
npm run dev

# 3. Check for port conflicts
# Windows PowerShell:
netstat -ano | findstr :5173
# Kill process if needed

# 4. Full clean restart
rm -rf node_modules/.vite
rm -rf public/build
php artisan optimize:clear
npm run dev
```

### Error: "Module not found" or "Cannot resolve module"

**Symptoms:**
- Import statements show red squiggles
- Vite build fails
- Runtime errors in browser

**Causes:**
1. Incorrect path alias usage
2. Missing file extensions
3. Case sensitivity issues (Windows vs Linux)
4. Outdated dependencies

**Solutions:**

```typescript
// ✗ Bad - relative import without extension
import { Button } from '../components/Button'

// ✓ Good - use path alias
import { Button } from '@/components/ui/button'

// ✓ Good - explicit extension for relative imports
import { utils } from '../lib/utils.ts'
```

**Fix:**
1. Check `tsconfig.json` paths configuration
2. Ensure consistent import styles
3. Run type checker: `npm run types`
4. Validate aliases: `npm run health-check`

---

## 3. Module Path Best Practices

### Use Path Aliases Consistently

**Current Configuration:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./resources/js/*"]
    }
  }
}
```

**Guidelines:**

```typescript
// ✓ GOOD - Use @ alias for project imports
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { User } from '@/types'

// ✗ BAD - Deep relative paths
import { Button } from '../../../components/ui/button'

// ✓ GOOD - Relative imports for sibling files
import { UserCard } from './user-card'
import type { Props } from './types'

// ✓ GOOD - Third-party imports
import { useState } from 'react'
import { router } from '@inertiajs/react'
```

### File Naming Conventions

```bash
# Components: kebab-case
button.tsx
user-profile-card.tsx

# Types: kebab-case
shared-types.ts
api-types.ts

# Hooks: kebab-case with use- prefix
use-appearance.ts
use-mobile.ts

# Pages: kebab-case
index.tsx
create.tsx
edit.tsx
```

---

## 4. Dependency Management

### Keep Dependencies Updated

```bash
# Check for outdated packages
npm outdated

# Update specific package
npm update package-name

# Update all packages (carefully!)
npm update

# Audit for vulnerabilities
npm audit
npm audit fix
```

### Version Compatibility Matrix

| Package | Version | Compatible With |
|---------|---------|-----------------|
| vite | ^7.0.4 | React 19+ |
| @vitejs/plugin-react | ^5.0.0 | React 19+ |
| react | ^19.2.0 | react-dom 19.2.0 |
| @inertiajs/react | ^2.1.4 | React 19+ |
| laravel-vite-plugin | ^2.0 | Vite 7+ |
| tailwindcss | ^4.0.0 | @tailwindcss/vite 4.1+ |

### Dependency Lock

**Always commit:**
- `package.json`
- `package-lock.json` (ensures consistent installs)

**Never commit:**
- `node_modules/`
- `.vite/` cache

---

## 5. Dynamic Import Monitoring

### Identifying Dynamic Imports

Dynamic imports can cause runtime errors if paths are incorrect:

```typescript
// ✗ Risky - dynamic import with variable
const Component = await import(`@/components/${name}`)

// ✓ Better - static import with lazy loading
const LazyComponent = lazy(() => import('@/components/heavy-component'))

// ✓ Best - code splitting with explicit paths
const routes = [
  {
    path: '/dashboard',
    component: lazy(() => import('@/pages/dashboard'))
  }
]
```

### Check for Dynamic Imports

The health check script automatically scans for dynamic imports and reports them. Review each one:

```bash
npm run health-check | grep "Dynamic import"
```

---

## 6. Browser Console Monitoring

### Enable Detailed Logging

Add to `vite.config.ts`:

```typescript
export default defineConfig({
  // ... other config
  logLevel: 'info', // or 'warn', 'error', 'silent'
  clearScreen: false, // Keep logs visible
})
```

### Monitor HMR Events

In browser console, watch for:

```javascript
// Good HMR update
[vite] hot updated: /resources/js/pages/dashboard.tsx

// Warning signs
[vite] hmr invalidate /resources/js/pages/dashboard.tsx
[vite] page reload on file change detected
```

### Common Console Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Failed to fetch dynamically imported module` | Broken dynamic import | Check file paths |
| `404 (Not Found)` for .js files | Build output missing | Run `npm run build` |
| `Unexpected token '<'` | Serving HTML instead of JS | Check Vite dev server |
| `Module not found` | Import path error | Verify file exists |

---

## 7. Cache Management

### Clear All Caches

```bash
# Vite cache
rm -rf node_modules/.vite

# Laravel cache
php artisan optimize:clear
php artisan view:clear
php artisan config:clear
php artisan route:clear

# Browser cache
# Chrome/Edge: Ctrl+Shift+Del → Clear cached images and files
# Or: Hard reload (Ctrl+Shift+R)

# Complete reset
rm -rf node_modules/.vite
rm -rf public/build
php artisan optimize:clear
npm run dev
```

### Prevent Cache Issues

**In Development:**
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    hmr: {
      overlay: true // Show errors in browser
    }
  },
  build: {
    sourcemap: true // Enable debugging
  }
})
```

---

## 8. Runtime Error Detection

### Enable Error Boundaries

```typescript
// app.tsx
import { ErrorBoundary } from '@/components/error-boundary'

export default function App({ children }) {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      {children}
    </ErrorBoundary>
  )
}
```

### Monitor Network Requests

In browser DevTools → Network tab:
- Filter by "JS" to see module loads
- Check for 404s on JavaScript files
- Verify HMR WebSocket connection (ws://)

---

## 9. CI/CD Integration

### Pre-commit Checks

```json
// package.json
{
  "scripts": {
    "precommit": "npm run health-check && npm run types && npm run lint",
    "prepush": "npm run health-check && npm run build"
  }
}
```

### GitHub Actions Example

```yaml
# .github/workflows/frontend-check.yml
name: Frontend Health Check

on: [push, pull_request]

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run health-check
      - run: npm run types
      - run: npm run build
```

---

## 10. Architectural Review Checklist

### When to Conduct Review

Conduct a broader architectural review if:
- ✗ Health checks consistently fail
- ✗ HMR errors occur daily
- ✗ Build times exceed 30 seconds
- ✗ Bundle size > 1MB (uncompressed)
- ✗ Multiple developers report same issues

### Review Areas

**1. Import Structure**
- [ ] All imports use path aliases (@/)
- [ ] No circular dependencies
- [ ] Tree-shaking friendly exports

**2. Component Organization**
- [ ] Logical directory structure
- [ ] Shared components in `/components`
- [ ] Page-specific components in `/pages/[page]/components`

**3. Code Splitting**
- [ ] Routes lazy-loaded
- [ ] Heavy libraries dynamically imported
- [ ] Vendor chunks properly configured

**4. Build Configuration**
- [ ] Source maps enabled for dev
- [ ] Minification enabled for prod
- [ ] Proper chunk splitting strategy

**5. Dependency Health**
- [ ] No unused dependencies
- [ ] No version conflicts
- [ ] Security vulnerabilities addressed

---

## 11. Quick Reference Commands

```bash
# Daily workflow
npm run health-check          # Check system health
npm run dev                   # Start dev server
npm run types                 # Type check
npm run lint                  # Lint and fix

# Troubleshooting
rm -rf node_modules/.vite     # Clear Vite cache
rm -rf node_modules           # Nuclear option
npm install                   # Reinstall
php artisan optimize:clear    # Clear Laravel cache

# Production
npm run build                 # Build for production
npm run build:ssr             # Build with SSR
npm run analyze               # Analyze bundle size

# Monitoring
npm run health-check          # Full health check
npm run types                 # TypeScript check
npm outdated                  # Check for updates
npm audit                     # Security audit
```

---

## 12. Escalation Path

### Level 1: Quick Fixes (< 5 minutes)
1. Restart Vite dev server
2. Hard reload browser (Ctrl+Shift+R)
3. Clear Vite cache

### Level 2: Standard Fixes (< 15 minutes)
1. Run health check: `npm run health-check`
2. Fix reported issues
3. Clear all caches
4. Restart dev server

### Level 3: Deep Dive (< 30 minutes)
1. Delete `node_modules` and reinstall
2. Check for dependency conflicts
3. Review recent code changes
4. Test in incognito/private browsing

### Level 4: Architectural Review (> 30 minutes)
1. Review import patterns across codebase
2. Analyze bundle size and splitting
3. Check for performance bottlenecks
4. Consider refactoring if patterns emerge

---

## 13. Monitoring Dashboard (Future Enhancement)

Consider implementing a monitoring dashboard that tracks:

- Build times (trend over time)
- Bundle sizes (per route/chunk)
- HMR update speed
- Failed reload count
- Dependency freshness
- TypeScript error count

Tools to consider:
- Vite Bundle Visualizer (already included)
- Lighthouse CI for performance
- Sentry for runtime errors
- Custom logging dashboard

---

## Conclusion

Regular monitoring and proactive maintenance prevent most Vite-related issues. The combination of:

1. **Automated health checks** (before/during development)
2. **Consistent import patterns** (path aliases)
3. **Proper cache management** (regular clearing)
4. **Dependency hygiene** (updates, audits)

...ensures a smooth development experience with minimal interruptions.

**Remember:** Most issues are preventable with good practices and early detection!

---

**Last Updated:** November 2, 2025  
**Maintained By:** Development Team  
**Next Review:** As needed or when major dependency updates occur
