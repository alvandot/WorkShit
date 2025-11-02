#!/usr/bin/env node

/**
 * Vite Health Check Script
 *
 * This script monitors and validates:
 * - Module paths and dependencies
 * - Dynamic imports
 * - TypeScript configuration
 * - Vite configuration
 * - Package.json dependencies
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(message) {
    log(`\n${'='.repeat(60)}`, 'cyan');
    log(message, 'cyan');
    log('='.repeat(60), 'cyan');
}

// Track issues
const issues = {
    critical: [],
    warnings: [],
    info: [],
};

/**
 * Parse JSON with comments (JSONC) - improved version
 */
function parseJSONC(content) {
    // Remove comments more carefully
    // Remove single-line comments but not URLs
    content = content.replace(/([^:])\/\/.*$/gm, '$1');
    // Remove multi-line comments
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove trailing commas before closing braces/brackets
    content = content.replace(/,(\s*[}\]])/g, '$1');
    // Parse and return
    return JSON.parse(content);
}

/**
 * Check 1: Validate TypeScript Configuration
 */
function checkTypeScriptConfig() {
    header('Checking TypeScript Configuration');

    const tsconfigPath = join(rootDir, 'tsconfig.json');

    if (!existsSync(tsconfigPath)) {
        issues.critical.push('tsconfig.json not found');
        log('✗ tsconfig.json not found', 'red');
        return;
    }

    try {
        const content = readFileSync(tsconfigPath, 'utf-8'); const tsconfig = parseJSONC(content);

        // Check paths configuration
        if (!tsconfig.compilerOptions?.paths) {
            issues.warnings.push('No path aliases configured in tsconfig.json');
            log('⚠ No path aliases configured', 'yellow');
        } else {
            log('✓ Path aliases configured', 'green');
            Object.entries(tsconfig.compilerOptions.paths).forEach(([alias, paths]) => {
                log(`  ${alias} → ${paths.join(', ')}`, 'blue');
            });
        }

        // Check module resolution
        const moduleResolution = tsconfig.compilerOptions?.moduleResolution;
        if (moduleResolution !== 'bundler' && moduleResolution !== 'node16' && moduleResolution !== 'nodenext') {
            issues.warnings.push(`Module resolution is "${moduleResolution}" - consider using "bundler"`);
            log(`⚠ Module resolution: ${moduleResolution}`, 'yellow');
        } else {
            log(`✓ Module resolution: ${moduleResolution}`, 'green');
        }

        // Check JSX configuration
        const jsx = tsconfig.compilerOptions?.jsx;
        if (!jsx) {
            issues.warnings.push('JSX not configured in tsconfig.json');
            log('⚠ JSX not configured', 'yellow');
        } else {
            log(`✓ JSX mode: ${jsx}`, 'green');
        }

    } catch (error) {
        issues.critical.push(`Error reading tsconfig.json: ${error.message}`);
        log(`✗ Error reading tsconfig.json: ${error.message}`, 'red');
    }
}

/**
 * Check 2: Validate Vite Configuration
 */
function checkViteConfig() {
    header('Checking Vite Configuration');

    const viteConfigPath = join(rootDir, 'vite.config.ts');

    if (!existsSync(viteConfigPath)) {
        issues.critical.push('vite.config.ts not found');
        log('✗ vite.config.ts not found', 'red');
        return;
    }

    try {
        const viteConfig = readFileSync(viteConfigPath, 'utf-8');

        // Check for required plugins
        const requiredPlugins = ['laravel', 'react', 'tailwindcss'];
        requiredPlugins.forEach(plugin => {
            if (viteConfig.includes(plugin)) {
                log(`✓ ${plugin} plugin found`, 'green');
            } else {
                issues.warnings.push(`${plugin} plugin not found in vite.config.ts`);
                log(`⚠ ${plugin} plugin not found`, 'yellow');
            }
        });

        // Check for refresh option
        if (viteConfig.includes('refresh:')) {
            log('✓ Hot reload enabled', 'green');
        } else {
            issues.info.push('Hot reload might not be configured');
            log('ℹ Hot reload configuration not detected', 'blue');
        }

    } catch (error) {
        issues.critical.push(`Error reading vite.config.ts: ${error.message}`);
        log(`✗ Error reading vite.config.ts: ${error.message}`, 'red');
    }
}

/**
 * Check 3: Validate Package Dependencies
 */
function checkPackageDependencies() {
    header('Checking Package Dependencies');

    const packagePath = join(rootDir, 'package.json');

    if (!existsSync(packagePath)) {
        issues.critical.push('package.json not found');
        log('✗ package.json not found', 'red');
        return;
    }

    try {
        const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));

        // Check critical dependencies
        const criticalDeps = [
            'vite',
            'laravel-vite-plugin',
            '@vitejs/plugin-react',
            'react',
            'react-dom',
            '@inertiajs/react',
        ];

        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

        criticalDeps.forEach(dep => {
            if (allDeps[dep]) {
                log(`✓ ${dep}: ${allDeps[dep]}`, 'green');
            } else {
                issues.critical.push(`Missing critical dependency: ${dep}`);
                log(`✗ Missing: ${dep}`, 'red');
            }
        });

        // Check for version conflicts
        const reactVersion = allDeps['react']?.replace(/[\^~]/, '');
        const reactDomVersion = allDeps['react-dom']?.replace(/[\^~]/, '');

        if (reactVersion !== reactDomVersion) {
            issues.warnings.push(`React version mismatch: react@${reactVersion} vs react-dom@${reactDomVersion}`);
            log(`⚠ React version mismatch: ${reactVersion} vs ${reactDomVersion}`, 'yellow');
        }

    } catch (error) {
        issues.critical.push(`Error reading package.json: ${error.message}`);
        log(`✗ Error reading package.json: ${error.message}`, 'red');
    }
}

/**
 * Check 4: Scan for Import Issues
 */
function scanImportIssues(dir = join(rootDir, 'resources', 'js'), depth = 0) {
    if (depth === 0) {
        header('Scanning for Import Issues');
    }

    if (depth > 5) return; // Prevent deep recursion

    const files = readdirSync(dir);

    files.forEach(file => {
        const fullPath = join(dir, file);
        const stat = statSync(fullPath);

        if (stat.isDirectory() && !file.startsWith('.')) {
            scanImportIssues(fullPath, depth + 1);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            try {
                const content = readFileSync(fullPath, 'utf-8');

                // Check for problematic import patterns
                const lines = content.split('\n');
                lines.forEach((line, index) => {
                    // Check for missing file extensions in relative imports
                    if (line.match(/import.*from\s+['"]\.\.?\//)) {
                        const match = line.match(/from\s+['"](\.\.?\/[^'"]+)['"]/);
                        if (match && match[1]) {
                            const importPath = match[1];
                            // If it doesn't end with .ts, .tsx, .js, .jsx or an alias
                            if (!importPath.match(/\.(ts|tsx|js|jsx)$/)) {
                                // Check if it's trying to import a file that should have an extension
                                const possibleFile = resolve(dirname(fullPath), importPath);
                                if (!existsSync(possibleFile) && !existsSync(possibleFile + '.tsx') && !existsSync(possibleFile + '.ts')) {
                                    const relPath = fullPath.replace(rootDir, '');
                                    issues.warnings.push(`Possible missing import in ${relPath}:${index + 1}`);
                                }
                            }
                        }
                    }

                    // Check for dynamic imports
                    if (line.includes('import(')) {
                        const relPath = fullPath.replace(rootDir, '');
                        issues.info.push(`Dynamic import found in ${relPath}:${index + 1}`);
                    }
                });

            } catch (error) {
                issues.warnings.push(`Error scanning ${fullPath}: ${error.message}`);
            }
        }
    });

    if (depth === 0) {
        log(`✓ Import scan completed`, 'green');
    }
}

/**
 * Check 5: Validate Path Aliases
 */
function checkPathAliases() {
    header('Validating Path Aliases');

    const tsconfigPath = join(rootDir, 'tsconfig.json');

    if (!existsSync(tsconfigPath)) {
        log('⚠ Cannot validate - tsconfig.json not found', 'yellow');
        return;
    }

    try {
        const content = readFileSync(tsconfigPath, 'utf-8'); const tsconfig = parseJSONC(content);
        const paths = tsconfig.compilerOptions?.paths || {};

        Object.entries(paths).forEach(([alias, [targetPath]]) => {
            // Remove the wildcard from alias and target
            const cleanAlias = alias.replace('/*', '');
            const cleanTarget = targetPath.replace('/*', '');
            const targetDir = join(rootDir, cleanTarget);

            if (existsSync(targetDir)) {
                log(`✓ ${cleanAlias} → ${cleanTarget} (exists)`, 'green');
            } else {
                issues.warnings.push(`Path alias target doesn't exist: ${cleanAlias} → ${cleanTarget}`);
                log(`✗ ${cleanAlias} → ${cleanTarget} (not found)`, 'red');
            }
        });

    } catch (error) {
        issues.critical.push(`Error validating path aliases: ${error.message}`);
        log(`✗ Error: ${error.message}`, 'red');
    }
}

/**
 * Check 6: Validate Node Modules
 */
function checkNodeModules() {
    header('Checking Node Modules');

    const nodeModulesPath = join(rootDir, 'node_modules');

    if (!existsSync(nodeModulesPath)) {
        issues.critical.push('node_modules directory not found - run npm install');
        log('✗ node_modules not found - run npm install', 'red');
        return;
    }

    log('✓ node_modules directory exists', 'green');

    // Check for package-lock.json
    const lockFilePath = join(rootDir, 'package-lock.json');
    if (existsSync(lockFilePath)) {
        log('✓ package-lock.json exists', 'green');
    } else {
        issues.warnings.push('package-lock.json not found - dependencies might not be locked');
        log('⚠ package-lock.json not found', 'yellow');
    }
}

/**
 * Generate Report
 */
function generateReport() {
    header('Health Check Summary');

    if (issues.critical.length === 0 && issues.warnings.length === 0) {
        log('\n✓ All checks passed! No issues found.\n', 'green');
    } else {
        if (issues.critical.length > 0) {
            log(`\n✗ Critical Issues (${issues.critical.length}):`, 'red');
            issues.critical.forEach((issue, i) => {
                log(`  ${i + 1}. ${issue}`, 'red');
            });
        }

        if (issues.warnings.length > 0) {
            log(`\n⚠ Warnings (${issues.warnings.length}):`, 'yellow');
            issues.warnings.forEach((issue, i) => {
                log(`  ${i + 1}. ${issue}`, 'yellow');
            });
        }

        if (issues.info.length > 0) {
            log(`\nℹ Info (${issues.info.length}):`, 'blue');
            issues.info.forEach((issue, i) => {
                log(`  ${i + 1}. ${issue}`, 'blue');
            });
        }
    }

    // Recommendations
    log('\n' + '='.repeat(60), 'cyan');
    log('Recommendations:', 'cyan');
    log('='.repeat(60), 'cyan');

    if (issues.critical.length > 0) {
        log('\n1. Fix critical issues immediately', 'red');
        log('2. Run: npm install', 'blue');
        log('3. Clear Vite cache: rm -rf node_modules/.vite', 'blue');
    }

    if (issues.warnings.length > 0) {
        log('\n• Review warnings and address when possible', 'yellow');
    }

    log('\n• Clear browser cache and hard reload (Ctrl+Shift+R)', 'blue');
    log('• Monitor Vite dev server logs for HMR errors', 'blue');
    log('• Check browser console for runtime errors', 'blue');

    log('\nFor persistent issues:', 'cyan');
    log('1. Delete node_modules and package-lock.json', 'blue');
    log('2. Run: npm install', 'blue');
    log('3. Restart Vite dev server', 'blue');
    log('4. Clear Laravel cache: php artisan optimize:clear', 'blue');

    log(''); // Empty line at end
}

/**
 * Main execution
 */
function main() {
    log('\n🔍 Vite Health Check Starting...', 'cyan');
    log(`Root Directory: ${rootDir}\n`, 'blue');

    checkTypeScriptConfig();
    checkViteConfig();
    checkPackageDependencies();
    checkPathAliases();
    checkNodeModules();
    scanImportIssues();
    generateReport();

    // Exit with appropriate code
    process.exit(issues.critical.length > 0 ? 1 : 0);
}

main();

