import { Component, ErrorInfo, ReactNode, Suspense } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="mb-4 rounded-full bg-destructive/10 p-6">
                        <svg
                            className="size-12 text-destructive"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                        Something went wrong
                    </h3>
                    <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                        We encountered an error while loading this component.
                        Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Refresh Page
                    </button>
                    {process.env.NODE_ENV === 'development' &&
                        this.state.error && (
                            <details className="mt-4 text-left">
                                <summary className="cursor-pointer text-sm font-medium">
                                    Error Details (Development)
                                </summary>
                                <pre className="mt-2 max-w-full overflow-auto rounded bg-muted p-2 text-xs">
                                    {this.state.error.message}
                                </pre>
                            </details>
                        )}
                </div>
            );
        }

        return this.props.children;
    }
}

// Lazy loading wrapper with error boundary
export function LazyWrapper({
    children,
    fallback,
}: {
    children: ReactNode;
    fallback?: ReactNode;
}) {
    return (
        <ErrorBoundary fallback={fallback}>
            <Suspense
                fallback={
                    <div className="flex items-center justify-center p-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                    </div>
                }
            >
                {children}
            </Suspense>
        </ErrorBoundary>
    );
}
