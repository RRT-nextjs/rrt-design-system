import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';

import { cn } from '../../lib/utils';

/**
 * Checkbox - role checkbox with indeterminate support.
 *
 * Reference: docs/spec/01-design-system.md §3.22
 *
 * @example
 *   <Checkbox checked={ok} onCheckedChange={setOk} />
 *   <Checkbox checked="indeterminate" />
 */
export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer size-5 shrink-0',
      'rounded-[var(--radius-sm)]',
      'border-2 border-[var(--color-rrt-line-strong)]',
      'bg-[var(--color-rrt-surface)]',
      'transition-colors duration-[var(--motion-duration-fast)]',
      'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
      'disabled:cursor-not-allowed disabled:opacity-55',
      'data-[state=checked]:bg-[var(--color-rrt-maroon-700)] data-[state=checked]:border-[var(--color-rrt-maroon-700)] data-[state=checked]:text-[var(--color-rrt-cream-50)]',
      'data-[state=indeterminate]:bg-[var(--color-rrt-maroon-700)] data-[state=indeterminate]:border-[var(--color-rrt-maroon-700)] data-[state=indeterminate]:text-[var(--color-rrt-cream-50)]',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      {props.checked === 'indeterminate' ? (
        <Minus aria-hidden="true" className="size-3.5" />
      ) : (
        <Check aria-hidden="true" className="size-3.5" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
