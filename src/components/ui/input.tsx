import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';

import { cn } from '../../lib/utils';

/**
 * Input - single-line text entry.
 *
 * Reference: docs/spec/01-design-system.md §3.2
 *
 * Always pair with FormField for labels and error wiring. Bare Input without
 * a label is a dev-mode warning.
 *
 * @example
 *   <FormField label="Email"><Input type="email" name="email" /></FormField>
 *   <Input size="xl" leadingIcon={Search} placeholder="Search students" />
 */
const inputVariants = cva(
  [
    'flex w-full',
    'rounded-[var(--radius-lg)]',
    'bg-[var(--color-rrt-surface)] text-[var(--color-rrt-text)]',
    'border border-[var(--color-rrt-line)]',
    'placeholder:text-[var(--color-rrt-text-faint)]',
    'transition-colors duration-[var(--motion-duration-fast)]',
    'hover:border-[var(--color-rrt-line-strong)]',
    'focus:outline-none focus:border-[var(--color-rrt-maroon-700)]',
    'focus-visible:shadow-[var(--shadow-focus)]',
    'disabled:opacity-55 disabled:cursor-not-allowed disabled:bg-[var(--color-rrt-surface-hover)]',
    'aria-[invalid=true]:border-[var(--color-rrt-error)]',
    'font-sans',
  ],
  {
    variants: {
      size: {
        md: 'h-10 px-3 [font-size:var(--text-body-sm)]',
        lg: 'h-12 px-4 [font-size:var(--text-body)]',
        xl: 'h-14 px-5 [font-size:var(--text-body)]',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  },
);

export type InputSize = NonNullable<VariantProps<typeof inputVariants>['size']>;

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  invalid?: boolean;
  leadingIcon?: LucideIcon;
  trailingIcon?: LucideIcon;
  trailingAction?: {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
  };
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size,
      invalid,
      leadingIcon: LeadingIcon,
      trailingIcon: TrailingIcon,
      trailingAction,
      type = 'text',
      ...props
    },
    ref,
  ) => {
    const hasLeading = !!LeadingIcon;
    const hasTrailing = !!TrailingIcon || !!trailingAction;

    if (!hasLeading && !hasTrailing) {
      return (
        <input
          ref={ref}
          type={type}
          aria-invalid={invalid || undefined}
          className={cn(inputVariants({ size }), className)}
          {...props}
        />
      );
    }

    return (
      <div className="relative w-full">
        {LeadingIcon ? (
          <LeadingIcon
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-[var(--icon-size-md)] text-[var(--color-rrt-text-faint)]"
          />
        ) : null}
        <input
          ref={ref}
          type={type}
          aria-invalid={invalid || undefined}
          className={cn(
            inputVariants({ size }),
            hasLeading && 'pl-10',
            hasTrailing && 'pr-10',
            className,
          )}
          {...props}
        />
        {trailingAction ? (
          <button
            type="button"
            onClick={trailingAction.onClick}
            aria-label={trailingAction.label}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2',
              'flex items-center justify-center',
              'size-11 rounded-[var(--radius-md)]',
              'text-[var(--color-rrt-text-soft)]',
              'hover:bg-[var(--color-rrt-surface-hover)]',
              'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
            )}
          >
            <trailingAction.icon
              aria-hidden="true"
              className="size-[var(--icon-size-md)]"
            />
          </button>
        ) : TrailingIcon ? (
          <TrailingIcon
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-[var(--icon-size-md)] text-[var(--color-rrt-text-faint)]"
          />
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { inputVariants };
