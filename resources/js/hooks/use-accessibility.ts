import { useEffect, useRef, useState } from 'react';

export interface AccessibilityOptions {
    'aria-label'?: string;
    'aria-describedby'?: string;
    'aria-expanded'?: boolean;
    'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
    'aria-selected'?: boolean;
    'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
    'aria-live'?: 'off' | 'assertive' | 'polite';
    'aria-atomic'?: boolean;
    role?: string;
    tabIndex?: number;
}

// Hook for managing ARIA attributes
export const useAriaAttributes = (options: AccessibilityOptions) => {
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        // Apply ARIA attributes
        Object.entries(options).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                element.setAttribute(key, String(value));
            } else {
                element.removeAttribute(key);
            }
        });

        return () => {
            // Cleanup attributes on unmount
            Object.keys(options).forEach((key) => {
                element.removeAttribute(key);
            });
        };
    }, [options]);

    return elementRef;
};

// Hook for keyboard navigation
export const useKeyboardNavigation = (
    onEnter?: () => void,
    onSpace?: () => void,
    onEscape?: () => void,
    onArrowUp?: () => void,
    onArrowDown?: () => void,
    onArrowLeft?: () => void,
    onArrowRight?: () => void,
    options: {
        preventDefault?: boolean;
        stopPropagation?: boolean;
    } = {},
) => {
    const { preventDefault = true, stopPropagation = false } = options;

    const handleKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case 'Enter':
                if (onEnter) {
                    if (preventDefault) event.preventDefault();
                    if (stopPropagation) event.stopPropagation();
                    onEnter();
                }
                break;
            case ' ':
                if (onSpace) {
                    if (preventDefault) event.preventDefault();
                    if (stopPropagation) event.stopPropagation();
                    onSpace();
                }
                break;
            case 'Escape':
                if (onEscape) {
                    if (preventDefault) event.preventDefault();
                    if (stopPropagation) event.stopPropagation();
                    onEscape();
                }
                break;
            case 'ArrowUp':
                if (onArrowUp) {
                    if (preventDefault) event.preventDefault();
                    if (stopPropagation) event.stopPropagation();
                    onArrowUp();
                }
                break;
            case 'ArrowDown':
                if (onArrowDown) {
                    if (preventDefault) event.preventDefault();
                    if (stopPropagation) event.stopPropagation();
                    onArrowDown();
                }
                break;
            case 'ArrowLeft':
                if (onArrowLeft) {
                    if (preventDefault) event.preventDefault();
                    if (stopPropagation) event.stopPropagation();
                    onArrowLeft();
                }
                break;
            case 'ArrowRight':
                if (onArrowRight) {
                    if (preventDefault) event.preventDefault();
                    if (stopPropagation) event.stopPropagation();
                    onArrowRight();
                }
                break;
        }
    };

    return handleKeyDown;
};

// Hook for managing focus
export const useFocusManagement = () => {
    const focusRef = useRef<HTMLElement>(null);

    const focusElement = () => {
        if (focusRef.current) {
            focusRef.current.focus();
        }
    };

    const blurElement = () => {
        if (focusRef.current) {
            focusRef.current.blur();
        }
    };

    return {
        focusRef,
        focusElement,
        blurElement,
    };
};

// Hook for skip links
export const useSkipLinks = () => {
    useEffect(() => {
        const handleSkipLink = (event: KeyboardEvent) => {
            if (event.key === 'Tab' && event.shiftKey) {
                // Handle shift+tab for skip links
                const skipLinks = document.querySelectorAll('[data-skip-link]');
                if (skipLinks.length > 0) {
                    const firstSkipLink = skipLinks[0] as HTMLElement;
                    firstSkipLink.style.display = 'block';
                    firstSkipLink.focus();
                }
            }
        };

        document.addEventListener('keydown', handleSkipLink);

        return () => {
            document.removeEventListener('keydown', handleSkipLink);
        };
    }, []);
};

// Hook for screen reader announcements
export const useScreenReaderAnnouncement = () => {
    const announcementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Create announcement element if it doesn't exist
        if (!announcementRef.current) {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.style.position = 'absolute';
            announcement.style.left = '-10000px';
            announcement.style.width = '1px';
            announcement.style.height = '1px';
            announcement.style.overflow = 'hidden';
            document.body.appendChild(announcement);
            announcementRef.current = announcement;
        }

        return () => {
            if (announcementRef.current && announcementRef.current.parentNode) {
                announcementRef.current.parentNode.removeChild(
                    announcementRef.current,
                );
            }
        };
    }, []);

    const announce = (
        message: string,
        priority: 'polite' | 'assertive' = 'polite',
    ) => {
        if (announcementRef.current) {
            announcementRef.current.setAttribute('aria-live', priority);
            announcementRef.current.textContent = message;

            // Clear after a delay to allow re-announcement of same message
            setTimeout(() => {
                if (announcementRef.current) {
                    announcementRef.current.textContent = '';
                }
            }, 1000);
        }
    };

    return announce;
};

// Utility function to generate unique IDs for ARIA relationships
let idCounter = 0;
export const generateUniqueId = (prefix = 'a11y') => {
    return `${prefix}-${++idCounter}`;
};

// Hook for managing ARIA described-by relationships
export const useAriaDescribedBy = (description: string) => {
    const [descriptionId] = useState<string>(() => generateUniqueId('desc'));
    const descriptionIdRef = useRef<string>(descriptionId);

    useEffect(() => {
        descriptionIdRef.current = descriptionId;
    }, [descriptionId]);

    useEffect(() => {
        const descriptionElement = document.createElement('div');
        descriptionElement.id = descriptionIdRef.current;
        descriptionElement.textContent = description;
        descriptionElement.style.position = 'absolute';
        descriptionElement.style.left = '-10000px';
        descriptionElement.style.width = '1px';
        descriptionElement.style.height = '1px';
        descriptionElement.style.overflow = 'hidden';

        document.body.appendChild(descriptionElement);

        return () => {
            if (descriptionElement.parentNode) {
                descriptionElement.parentNode.removeChild(descriptionElement);
            }
        };
    }, [description]);

    return descriptionId;
};
