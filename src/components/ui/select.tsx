import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '../../lib/utils';

/**
 * Select - single-choice from a list of options.
 *
 * Reference: docs/spec/01-design-system.md §3.3
 * Built on Radix Select; type-ahead + arrow keys + role=combobox shipped.
 *
 * @example
 *   <Select value={programId} onValueChange={setProgramId}>
 *     <SelectTrigger><SelectValue placeholder="Pick a program" /></SelectTrigger>
 *     <SelectContent>
 *       <SelectItem value="preschool">Preschool</SelectItem>
 *       <SelectItem value="beginners">Beginners</SelectItem>
 *     </SelectContent>
 *   </Select>
 */
export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

type TriggerSize = 'md' | 'lg' | 'xl';

const triggerSizeClass: Record<TriggerSize, string> = {
  md: 'h-10 px-3 [font-size:var(--text-body-sm)]',
  lg: 'h-12 px-4 [font-size:var(--text-body)]',
  xl: 'h-14 px-5 [font-size:var(--text-body)]',
};

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    size?: TriggerSize;
    invalid?: boolean;
  }
>(({ className, children, size = 'lg', invalid, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    aria-invalid={invalid || undefined}
    className={cn(
      'inline-flex w-full items-center justify-between gap-2',
      'rounded-[var(--radius-lg)]',
      'bg-[var(--color-rrt-surface)] text-[var(--color-rrt-text)]',
      'border border-[var(--color-rrt-line)]',
      'transition-colors duration-[var(--motion-duration-fast)]',
      'hover:border-[var(--color-rrt-line-strong)]',
      'focus:outline-none focus:border-[var(--color-rrt-maroon-700)]',
      'focus-visible:shadow-[var(--shadow-focus)]',
      'disabled:opacity-55 disabled:cursor-not-allowed',
      'aria-[invalid=true]:border-[var(--color-rrt-error)]',
      'data-[placeholder]:text-[var(--color-rrt-text-faint)]',
      'font-sans',
      triggerSizeClass[size],
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown
        aria-hidden="true"
        className="size-[var(--icon-size-md)] opacity-60"
      />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ChevronUp aria-hidden="true" className="size-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

export const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ChevronDown aria-hidden="true" className="size-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      className={cn(
        'relative z-50 max-h-96 min-w-32 overflow-hidden',
        'rounded-[var(--radius-lg)]',
        'bg-[var(--color-rrt-surface)] text-[var(--color-rrt-text)]',
        'border border-[var(--color-rrt-line)]',
        'shadow-[var(--shadow-lg)]',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

export const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 [font-size:var(--text-caption)] font-semibold text-[var(--color-rrt-text-soft)] uppercase tracking-wider',
      className,
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center',
      'rounded-[var(--radius-md)]',
      'py-2 pl-8 pr-2 [font-size:var(--text-body-sm)]',
      'outline-none',
      'focus:bg-[var(--color-rrt-surface-hover)]',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-55',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check aria-hidden="true" className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-[var(--color-rrt-line)]', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
