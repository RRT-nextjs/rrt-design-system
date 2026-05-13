import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

/**
 * Badge - compact status indicator. Inline with text or as a row affix.
 *
 * Reference: docs/spec/01-design-system.md §3.11
 *
 * @example
 *   <Badge variant="success">Active</Badge>
 *   <Badge variant="warning" size="sm">Trial</Badge>
 */
const badgeVariants = cva(
  [
    'inline-flex items-center gap-1',
    'rounded-[var(--radius-md)]',
    'font-sans font-semibold',
    'whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        neutral: [
          'bg-[var(--color-rrt-surface-hover)] text-[var(--color-rrt-text-soft)]',
          'border border-[var(--color-rrt-line)]',
        ],
        success: [
          'bg-[var(--color-rrt-success-bg)] text-[var(--color-rrt-success)]',
        ],
        warning: [
          'bg-[var(--color-rrt-warning-bg)] text-[var(--color-rrt-warning)]',
        ],
        error: [
          'bg-[var(--color-rrt-error-bg)] text-[var(--color-rrt-error)]',
        ],
        info: [
          'bg-[var(--color-rrt-info-bg)] text-[var(--color-rrt-info)]',
        ],
        maroon: [
          'bg-[var(--color-rrt-maroon-50)] text-[var(--color-rrt-maroon-700)]',
        ],
      },
      size: {
        sm: 'h-5 px-2 text-[var(--text-caption)]',
        md: 'h-6 px-2.5 text-[var(--text-body-sm)]',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  },
);

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Badge.displayName = 'Badge';
