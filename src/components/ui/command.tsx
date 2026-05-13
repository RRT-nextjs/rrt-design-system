import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';

import { cn } from '../../lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from './dialog';

/**
 * Command - keyboard-driven command palette substrate (the Cmd-K core).
 *
 * Reference: docs/spec/01-design-system.md §3.29
 *
 * Built on cmdk@1.0.0. Wrapped in Dialog for the modal-palette variant.
 *
 * Data source is provided by the consumer; server-side filter (per critique
 * 04 Failure 3) lives in the consumer app's /api/palette/search endpoint.
 * This primitive does not assume what data is being searched.
 *
 * @example
 *   <CommandDialog open={open} onOpenChange={setOpen}>
 *     <CommandInput placeholder="Search students, classes, actions..." />
 *     <CommandList>
 *       <CommandEmpty>No results.</CommandEmpty>
 *       <CommandGroup heading="Students">
 *         <CommandItem onSelect={() => go('mia')}>Mia A.</CommandItem>
 *       </CommandGroup>
 *     </CommandList>
 *   </CommandDialog>
 */
export const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden',
      'rounded-[var(--radius-xl)]',
      'bg-[var(--color-rrt-surface)] text-[var(--color-rrt-text)]',
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

export interface CommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * CommandDialog - the modal-palette wrapper. 640px centered, shadow-lg.
 *
 * Includes a visually-hidden DialogTitle and DialogDescription so screen
 * readers announce the dialog purpose. Per the spec §3.29 a11y contract,
 * the search input also exposes aria-autocomplete and aria-controls (handled
 * by cmdk internally).
 */
export function CommandDialog({
  open,
  onOpenChange,
  title = 'Command palette',
  description = 'Search students, classes, and actions.',
  children,
}: CommandDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="md"
        hideCloseButton
        className="p-0 max-w-[640px] overflow-hidden"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        <Command
          shouldFilter={true}
          className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[var(--text-caption)] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[var(--color-rrt-text-soft)]"
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className="flex items-center gap-2 border-b border-[var(--color-rrt-line)] px-3"
    cmdk-input-wrapper=""
  >
    <Search
      aria-hidden="true"
      className="size-4 shrink-0 text-[var(--color-rrt-text-faint)]"
    />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'flex h-12 w-full bg-transparent py-3',
        'text-[var(--text-body)] text-[var(--color-rrt-text)]',
        'outline-none placeholder:text-[var(--color-rrt-text-faint)]',
        'disabled:cursor-not-allowed disabled:opacity-55',
        className,
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

export const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('max-h-[420px] overflow-y-auto overflow-x-hidden p-1', className)}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

export const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-[var(--text-body-sm)] text-[var(--color-rrt-text-soft)]"
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

export const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden p-1 text-[var(--color-rrt-text)]',
      className,
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

export const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-[var(--color-rrt-line)]', className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

export const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center gap-2',
      'rounded-[var(--radius-md)] px-2 py-2',
      'text-[var(--text-body-sm)] outline-none',
      'aria-selected:bg-[var(--color-rrt-surface-hover)]',
      'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-55',
      className,
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

export function CommandShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'ml-auto text-[var(--text-caption)] tracking-wider',
        'text-[var(--color-rrt-text-faint)]',
        className,
      )}
      {...props}
    />
  );
}
