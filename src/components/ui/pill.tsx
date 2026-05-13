import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

/**
 * Pill - selectable filter chip. 44pt minimum tap target (WCAG 2.5.5 AA).
 *
 * Reference: docs/spec/01-design-system.md §3.12
 *
 * Pill is taller than Badge intentionally - Pill is INTERACTIVE, Badge is
 * STATIC. Use Pill for filter chips on Students CRM list, schedule filters.
 *
 * @example
 *   <Pill selected={isActive} onSelect={() => toggle()}>Active</Pill>
 */
const pillVariants = cva(
  [
    'inline-flex items-center gap-1.5',
    'rounded-[var(--radius-pill)]',
    'font-sans font-semibold',
    'transition-colors duration-[var(--motion-duration-fast)]',
    'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
    'disabled:opacity-55 disabled:cursor-not-allowed',
    'whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        default: '',
        maroon: '',
      },
      size: {
        sm: 'h-9 px-3 text-[var(--text-body-sm)]',
        md: 'h-11 px-4 text-[var(--text-body-sm)]',
      },
      selected: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        selected: false,
        class: cn(
          'bg-[var(--color-rrt-surface)] text-[var(--color-rrt-text)]',
          'border border-[var(--color-rrt-line)]',
          'hover:bg-[var(--color-rrt-surface-hover)]',
        ),
      },
      {
        variant: 'default',
        selected: true,
        class: cn(
          'bg-[var(--color-rrt-maroon-700)] text-[var(--color-rrt-cream-50)]',
          'border border-[var(--color-rrt-maroon-700)]',
        ),
      },
      {
        variant: 'maroon',
        selected: false,
        class: cn(
          'bg-[var(--color-rrt-maroon-50)] text-[var(--color-rrt-maroon-700)]',
          'border border-[var(--color-rrt-maroon-300)]',
        ),
      },
      {
        variant: 'maroon',
        selected: true,
        class: cn(
          'bg-[var(--color-rrt-maroon-700)] text-[var(--color-rrt-cream-50)]',
          'border border-[var(--color-rrt-maroon-700)]',
        ),
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      selected: false,
    },
  },
);

export interface PillProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof pillVariants> {
  selected?: boolean;
  onSelect?: () => void;
  children: React.ReactNode;
}

export const Pill = React.forwardRef<HTMLButtonElement, PillProps>(
  ({ className, variant, size, selected, onSelect, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(pillVariants({ variant, size, selected }), className)}
      {...props}
    >
      {children}
    </button>
  ),
);
Pill.displayName = 'Pill';
