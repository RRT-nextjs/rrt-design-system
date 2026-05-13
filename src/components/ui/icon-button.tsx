import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';

import { cn } from '../../lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

/**
 * IconButton - icon-only button. Forces aria-label and auto-wraps in Tooltip.
 *
 * Reference: docs/spec/01-design-system.md §3.28
 *
 * 44pt minimum tap target on md and lg. The sm size (32pt) is allowed ONLY
 * on desktop admin surfaces, never on touch.
 *
 * @example
 *   <IconButton icon={Pencil} label="Edit student" onClick={openEdit} />
 *   <IconButton icon={Trash} label="Delete" variant="ghost" size="md" />
 */
const iconButtonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-[var(--radius-md)]',
    'transition-colors duration-[var(--motion-duration-fast)]',
    'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
    'disabled:opacity-55 disabled:cursor-not-allowed',
    'aria-disabled:opacity-55 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        ghost:
          'bg-transparent text-[var(--color-rrt-text-soft)] hover:bg-[var(--color-rrt-surface-hover)] hover:text-[var(--color-rrt-text)]',
        secondary:
          'bg-[var(--color-rrt-surface)] text-[var(--color-rrt-maroon-700)] border border-[var(--color-rrt-line)] hover:bg-[var(--color-rrt-surface-hover)]',
      },
      size: {
        sm: 'size-8 [&_svg]:size-4',
        md: 'size-11 [&_svg]:size-5',
        lg: 'size-12 [&_svg]:size-5',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
  },
);

export interface IconButtonProps
  extends Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      'children'
    >,
    VariantProps<typeof iconButtonVariants> {
  icon: LucideIcon;
  label: string;
  hideTooltip?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant,
      size,
      icon: Icon,
      label,
      hideTooltip,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const button = (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        className={cn(iconButtonVariants({ variant, size }), className)}
        {...props}
      >
        <Icon aria-hidden="true" />
      </button>
    );

    if (hideTooltip) return button;

    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);
IconButton.displayName = 'IconButton';
