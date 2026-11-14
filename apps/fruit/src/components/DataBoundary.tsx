import { Suspense, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useHydrated } from "../hooks/useHydrated";
import LoadError from "./LoadError";

interface DataBoundaryProps {
  /** Shown on the server, while hydrating and while the data loads. */
  fallback: ReactNode;
  errorTitle: string;
  errorClassName?: string;
  /** A change in these values retries after an error. */
  resetKeys?: unknown[];
  children: ReactNode;
}

/**
 * Boundary around content that reads fetched data with `use()`: pending, error and success are
 * three distinct renders. The content only renders in the browser, where the data can be fetched.
 */
export default function DataBoundary({
  fallback,
  errorTitle,
  errorClassName,
  resetKeys,
  children,
}: DataBoundaryProps) {
  const hydrated = useHydrated();

  return (
    <ErrorBoundary
      resetKeys={resetKeys}
      // oxlint-disable-next-line react/no-unstable-nested-components -- the boundary's render prop; it holds no state
      fallbackRender={({ error, resetErrorBoundary }) => (
        <LoadError
          title={errorTitle}
          error={error}
          onRetry={resetErrorBoundary}
          className={errorClassName}
        />
      )}
    >
      <Suspense fallback={fallback}>{hydrated ? children : fallback}</Suspense>
    </ErrorBoundary>
  );
}
