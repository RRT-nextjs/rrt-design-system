import * as React from 'react';

import { cn } from '../../lib/utils';

/**
 * LoadingState - Suspense fallback. Spinner + label OR skeleton.
 *
 * Reference: docs/spec/01-design-system.md §3.27 + §4.5
 *
 * Spinner: small ribbon-arc SVG, 1.2s infinite rotation. Pulses (no rotation)
 * when prefers-reduced-motion is set.
 *
 * Skeleton: cream-tinted pulse on a sized container.
 *
 * @example
 *   <LoadingState />
 *   <LoadingState variant="spinner" label="Loading classes..." />
 *   <LoadingState variant="skeleton" skeletonHeight={120} />
 */
export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'spinner' | 'skeleton';
  label?: string;
  skeletonHeight?: number;
}

/**
 * RibbonArc - small SVG that traces a partial arc; used as the spinner glyph.
 * Stroke is currentColor so it inherits text color of the container.
 */
function RibbonArc({ size = 24 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2 A10 10 0 0 1 22 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LoadingState({
  className,
  variant = 'spinner',
  label,
  skeletonHeight = 80,
  ...props
}: LoadingStateProps) {
  if (variant === 'skeleton') {
    return (
      <div
        aria-busy="true"
        role="status"
        className={cn(
          'w-full',
          'rounded-[var(--radius-lg)]',
          'bg-[var(--color-rrt-surface-hover)]',
          'animate-pulse',
          className,
        )}
        style={{ height: skeletonHeight }}
        {...props}
      >
        {label ? <span className="sr-only">{label}</span> : null}
      </div>
    );
  }

  return (
    <div
      aria-busy="true"
      role="status"
      className={cn(
        'flex flex-col items-center justify-center gap-3 p-6',
        'text-[var(--color-rrt-maroon-700)]',
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'inline-flex items-center justify-center',
          'animate-spin motion-reduce:animate-pulse',
        )}
        style={{ animationDuration: '1.2s' }}
      >
        <RibbonArc size={24} />
      </span>
      {label ? (
        <span className="text-[var(--text-body-sm)] text-[var(--color-rrt-text-soft)]">
          {label}
        </span>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  );
}
