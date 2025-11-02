import { useEffect } from 'react';
import type { Metric } from 'web-vitals';

export const useWebVitals = () => {
    useEffect(() => {
        // Load web-vitals library dynamically
        import('web-vitals')
            .then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
                // Track Core Web Vitals
                onCLS((metric: Metric) => {
                    console.log('CLS:', metric);
                    sendToAnalytics(metric);
                });

                onFCP((metric: Metric) => {
                    console.log('FCP:', metric);
                    sendToAnalytics(metric);
                });

                onLCP((metric: Metric) => {
                    console.log('LCP:', metric);
                    sendToAnalytics(metric);
                });

                onTTFB((metric: Metric) => {
                    console.log('TTFB:', metric);
                    sendToAnalytics(metric);
                });

                // INP replaces FID in newer versions
                onINP((metric: Metric) => {
                    console.log('INP:', metric);
                    sendToAnalytics(metric);
                });
            })
            .catch((error) => {
                console.warn('Failed to load web-vitals:', error);
            });
    }, []);
};

const sendToAnalytics = (metric: Metric) => {
    // In a real app, you would send this to your analytics service
    // For now, we'll just log it. You can integrate with:
    // - Google Analytics 4
    // - Mixpanel
    // - Custom analytics endpoint
    // - Sentry
    // - etc.

    const data = {
        event: 'web_vitals',
        metric_name: metric.name,
        metric_value: metric.value,
        metric_id: metric.id,
        metric_delta: metric.delta,
        timestamp: Date.now(),
        url: window.location.href,
    };

    // Example: Send to custom endpoint
    if (process.env.NODE_ENV === 'production') {
        fetch('/api/analytics/web-vitals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).catch((error) => {
            console.warn('Failed to send web vitals:', error);
        });
    }

    // For development, you might want to send to a development analytics service
    // or just log to console
    if (process.env.NODE_ENV === 'development') {
        console.log('Web Vitals:', data);
    }
};
