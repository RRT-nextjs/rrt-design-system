import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react';

import { cn } from '../../lib/utils';

/**
 * Banner - in-page non-dismissable contextual messaging. NOT a notification.
 *
 * Reference: docs/spec/01-design-system.md §3.10
 *
 * Used for: "Memory-only mode", stale-data warnings, blackout notices.
 *
 * @example
 *   <Banner
 *     variant="warning"
 *     title="Stale data"
 *     description="Last fetched 30s ago."
 *     action={{ label: 'Refresh', onClick: refetch }}
 *   />
 */
const bannerVariants = cva(
  [
    'flex items-start gap-3 w-full',
    'rounded-[var(--radius-lg)] border p-4',
    'text-[var(--text-body-sm)]',
  ],
  {
    variants: {
      variant: {
        info: [
          'bg-[var(--color-rrt-info-bg)] text-[var(--color-rrt-info)]',
          'border-[var(--color-rrt-info)]',
        ],
        warning: [
          'bg-[var(--color-rrt-warning-bg)] text-[var(--color-rrt-warning)]',
          'border-[var(--color-rrt-warning)]',
        ],
        error: [
          'bg-[var(--color-rrt-error-bg)] text-[var(--color-rrt-error)]',
          'border-[var(--color-rrt-error)]',
        ],
        success: [
          'bg-[var(--color-rrt-success-bg)] text-[var(--color-rrt-success)]',
          'border-[var(--color-rrt-success)]',
        ],
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

const variantIcon = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle2,
} as const;

const variantRole = {
  info: 'status' as const,
  success: 'status' as const,
  warning: 'alert' as const,
  error: 'alert' as const,
};

export interface BannerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof bannerVariants> {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      className,
      variant = 'info',
      title,
      description,
      action,
      dismissible,
      onDismiss,
      ...props
    },
    ref,
  ) => {
    const Icon = variant ? variantIcon[variant] : Info;
    return (
      <div
        ref={ref}
        role={variant ? variantRole[variant] : 'status'}
        className={cn(bannerVariants({ variant }), className)}
        {...props}
      >
        <Icon aria-hidden="true" className="size-5 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold">{title}</p>
          {description ? (
            <p className="mt-1 opacity-90">{description}</p>
          ) : null}
          {action ? (
            <button
              type="button"
              onClick={action.onClick}
              className={cn(
                'mt-2 inline-flex items-center justify-center',
                'h-9 px-3 rounded-[var(--radius-md)]',
                'border border-current bg-transparent',
                'text-[var(--text-body-sm)] font-semibold',
                'hover:opacity-90',
                'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
              )}
            >
              {action.label}
            </button>
          ) : null}
        </div>
        {dismissible ? (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className={cn(
              'shrink-0 rounded-[var(--radius-md)] p-1',
              'opacity-70 hover:opacity-100',
              'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
            )}
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        ) : null}
      </div>
    );
  },
);
Banner.displayName = 'Banner';
