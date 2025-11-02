import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { useWebVitals } from './hooks/use-web-vitals';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// App wrapper component to include web vitals tracking
const AppWrapper = ({ children }: { children: React.ReactNode }) => {
    useWebVitals();

    return <>{children}</>;
};

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <AppWrapper>
                    <App {...props} />
                </AppWrapper>
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

// Initialize PWA functionality
if (typeof window !== 'undefined') {
    // Add manifest link to head if not already present
    if (!document.querySelector('link[rel="manifest"]')) {
        const manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        manifestLink.href = '/manifest.json';
        document.head.appendChild(manifestLink);
    }

    // Add theme-color meta tag
    if (!document.querySelector('meta[name="theme-color"]')) {
        const themeColorMeta = document.createElement('meta');
        themeColorMeta.name = 'theme-color';
        themeColorMeta.content = '#3b82f6';
        document.head.appendChild(themeColorMeta);
    }

    // Add apple-touch-icon
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
        const appleTouchIcon = document.createElement('link');
        appleTouchIcon.rel = 'apple-touch-icon';
        appleTouchIcon.href = '/build/favicon.ico';
        document.head.appendChild(appleTouchIcon);
    }
}
