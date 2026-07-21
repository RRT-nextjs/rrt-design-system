import * as React from 'react';
import { AlertCircle } from 'lucide-react';

import { cn } from '../../lib/utils';

/**
 * ErrorState - "Something went wrong" boundary content. Distinct from
 * EmptyState because errors are unexpected.
 *
 * Reference: docs/spec/01-design-system.md §3.26
 *
 * @example
 *   <ErrorState onRetry={refetch} />
 *   <ErrorState
 *     title="Couldn't load classes"
 *     description="Check your connection and try again."
 *     onRetry={refetch}
 *   />
 */
export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  className,
  title = 'Something went wrong',
  description,
  onRetry,
  retryLabel = 'Try again',
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'gap-6 p-12',
        'bg-[var(--color-rrt-surface)]',
        'rounded-[var(--radius-xl)]',
        'border border-[var(--color-rrt-line)]',
        className,
      )}
      {...props}
    >
      <AlertCircle
        aria-hidden="true"
        className="size-12 text-[var(--color-rrt-error)]"
        strokeWidth={1.5}
      />
      <div className="flex flex-col gap-2 max-w-prose">
        <h3 className="font-display [font-size:var(--text-h3)] text-[var(--color-rrt-text)]">
          {title}
        </h3>
        {description ? (
          <p className="[font-size:var(--text-body)] text-[var(--color-rrt-text-soft)]">
            {description}
          </p>
        ) : null}
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            'inline-flex items-center justify-center',
            'h-12 px-5 rounded-[var(--radius-lg)]',
            'bg-[var(--color-rrt-surface)] text-[var(--color-rrt-maroon-700)]',
            'border border-[var(--color-rrt-line)]',
            '[font-size:var(--text-body)] font-semibold',
            'hover:bg-[var(--color-rrt-surface-hover)]',
            'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
          )}
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}
