"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="rounded-brand bg-red-50 p-6 text-center">
          <p className="font-bold text-red-700">Une erreur est survenue</p>
          <button onClick={() => this.setState({ hasError: false })} className="mt-3 text-sm text-sky hover:underline">
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
