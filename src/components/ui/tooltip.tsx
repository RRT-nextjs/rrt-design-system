import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '../../lib/utils';

/**
 * Tooltip - hover/focus-revealed label for icon-only buttons and dense
 * controls.
 *
 * Reference: docs/spec/01-design-system.md §3.14
 *
 * Tap-target friendly: appears on focus (keyboard) as well as hover.
 * Never used to convey load-bearing information.
 *
 * @example
 *   <TooltipProvider>
 *     <Tooltip>
 *       <TooltipTrigger asChild><IconButton ... /></TooltipTrigger>
 *       <TooltipContent>Delete student</TooltipContent>
 *     </Tooltip>
 *   </TooltipProvider>
 */
export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden',
        'rounded-[var(--radius-md)] px-3 py-1.5',
        'bg-[var(--color-rrt-maroon-900)] text-[var(--color-rrt-cream-50)]',
        '[font-size:var(--text-body-sm)] font-medium',
        'shadow-[var(--shadow-md)]',
        'animate-in fade-in-0 zoom-in-95',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
