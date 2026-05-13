import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';

import { cn } from '../../lib/utils';

/**
 * RadioGroup - role radiogroup with one-of-many semantics.
 *
 * Reference: docs/spec/01-design-system.md §3.23
 *
 * @example
 *   <RadioGroup value={mode} onValueChange={setMode}>
 *     <div className="flex items-center gap-2">
 *       <RadioGroupItem id="comfort" value="comfort" />
 *       <label htmlFor="comfort">Comfort</label>
 *     </div>
 *     <div className="flex items-center gap-2">
 *       <RadioGroupItem id="dense" value="dense" />
 *       <label htmlFor="dense">Dense</label>
 *     </div>
 *   </RadioGroup>
 */
export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn('grid gap-2', className)}
    {...props}
  />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'aspect-square size-5 rounded-full',
      'border-2 border-[var(--color-rrt-line-strong)]',
      'bg-[var(--color-rrt-surface)]',
      'transition-colors duration-[var(--motion-duration-fast)]',
      'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
      'disabled:cursor-not-allowed disabled:opacity-55',
      'data-[state=checked]:border-[var(--color-rrt-maroon-700)]',
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <Circle
        aria-hidden="true"
        className="size-2.5 fill-[var(--color-rrt-maroon-700)] text-[var(--color-rrt-maroon-700)]"
      />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
