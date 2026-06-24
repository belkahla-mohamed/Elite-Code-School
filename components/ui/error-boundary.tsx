"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6">
          <AlertTriangle className="size-12 text-coral mb-4" />
          <h3 className="font-display font-black text-xl text-ink mb-2">
            Une erreur est survenue
          </h3>
          <p className="font-body text-sm text-ink-soft max-w-sm mb-6">
            Quelque chose s&apos;est mal passé. Veuillez réessayer.
          </p>
          <Button variant="primary" onClick={this.handleRetry}>
            Réessayer
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
export type { ErrorBoundaryProps };
