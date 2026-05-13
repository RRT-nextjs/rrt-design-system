import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '../../lib/utils';

/**
 * Tabs - tab strip for switching between views in the same context.
 *
 * Reference: docs/spec/01-design-system.md §3.16
 *
 * Built on Radix Tabs. role="tablist", arrow keys + Home/End navigate.
 *
 * @example
 *   <Tabs defaultValue="active">
 *     <TabsList>
 *       <TabsTrigger value="active">Active</TabsTrigger>
 *       <TabsTrigger value="all">All</TabsTrigger>
 *       <TabsTrigger value="trial">Trial</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="active">...</TabsContent>
 *   </Tabs>
 */
export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-11 items-center justify-center gap-1',
      'rounded-[var(--radius-lg)] p-1',
      'bg-[var(--color-rrt-surface-hover)] text-[var(--color-rrt-text-soft)]',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap',
      'rounded-[var(--radius-md)] px-3 py-1.5',
      'text-[var(--text-body-sm)] font-semibold',
      'ring-offset-background',
      'transition-all duration-[var(--motion-duration-fast)]',
      'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
      'disabled:pointer-events-none disabled:opacity-55',
      'data-[state=active]:bg-[var(--color-rrt-surface)] data-[state=active]:text-[var(--color-rrt-text)]',
      'data-[state=active]:shadow-[var(--shadow-sm)]',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4',
      'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
      'rounded-[var(--radius-lg)]',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
