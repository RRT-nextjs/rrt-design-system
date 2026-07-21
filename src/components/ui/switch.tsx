import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '../../lib/utils';

/**
 * Switch - boolean toggle. Tap target 44pt minimum.
 *
 * Reference: docs/spec/01-design-system.md §3.21
 *
 * Used for: Comfort Mode toggle, "photo consent" toggle on Family form.
 *
 * @example
 *   <Switch
 *     checked={comfortMode}
 *     onCheckedChange={setComfortMode}
 *     label="Comfort Mode"
 *     description="Larger tap targets and wider spacing."
 *   />
 */
export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: string;
  description?: string;
}

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, label, description, id: providedId, ...props }, ref) => {
  const reactId = React.useId();
  const id = providedId ?? `switch-${reactId}`;
  const descriptionId = description ? `${id}-description` : undefined;

  const control = (
    <SwitchPrimitive.Root
      ref={ref}
      id={id}
      aria-describedby={descriptionId}
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0',
        'cursor-pointer items-center',
        'rounded-[var(--radius-pill)]',
        'border-2 border-transparent',
        'transition-colors duration-[var(--motion-duration-fast)]',
        'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
        'disabled:cursor-not-allowed disabled:opacity-55',
        'data-[state=checked]:bg-[var(--color-rrt-maroon-700)]',
        'data-[state=unchecked]:bg-[var(--color-rrt-line-strong)]',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block size-5 rounded-full',
          'bg-[var(--color-rrt-cream-50)]',
          'shadow-[var(--shadow-sm)] ring-0',
          'transition-transform duration-[var(--motion-duration-fast)]',
          'data-[state=checked]:translate-x-5',
          'data-[state=unchecked]:translate-x-0',
        )}
      />
    </SwitchPrimitive.Root>
  );

  if (!label && !description) {
    return control;
  }

  return (
    <div className="flex items-start gap-3">
      {control}
      <div className="flex-1 -mt-0.5">
        {label ? (
          <label
            htmlFor={id}
            className="[font-size:var(--text-body-sm)] font-semibold text-[var(--color-rrt-text)] cursor-pointer"
          >
            {label}
          </label>
        ) : null}
        {description ? (
          <p
            id={descriptionId}
            className="[font-size:var(--text-caption)] text-[var(--color-rrt-text-soft)]"
          >
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
});
Switch.displayName = SwitchPrimitive.Root.displayName;
