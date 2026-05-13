import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from '../../lib/utils';

/**
 * Sheet - slide-in panel from any edge. Used for class detail (right side
 * on desktop), kiosk class picker (bottom on mobile), trial booking detail.
 *
 * Reference: docs/spec/01-design-system.md §3.8
 *
 * @example
 *   <Sheet open={open} onOpenChange={setOpen}>
 *     <SheetContent side="right" size="md">
 *       <SheetHeader>
 *         <SheetTitle>Class detail</SheetTitle>
 *       </SheetHeader>
 *       <p>...</p>
 *     </SheetContent>
 *   </Sheet>
 */
export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50',
      'bg-[rgba(58,31,28,0.4)]',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

const sheetVariants = cva(
  [
    'fixed z-50 gap-4 p-6',
    'bg-[var(--color-rrt-surface)] text-[var(--color-rrt-text)]',
    'shadow-[var(--shadow-lg)]',
    'transition ease-[var(--motion-ease-in-out)]',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:duration-[var(--motion-duration-normal)]',
    'data-[state=open]:duration-[var(--motion-duration-normal)]',
  ],
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b border-[var(--color-rrt-line)] data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t border-[var(--color-rrt-line)] rounded-t-[var(--radius-2xl)] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full border-r border-[var(--color-rrt-line)] data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
        right:
          'inset-y-0 right-0 h-full border-l border-[var(--color-rrt-line)] data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
        xl: '',
      },
    },
    compoundVariants: [
      { side: ['left', 'right'], size: 'sm', class: 'w-[320px]' },
      { side: ['left', 'right'], size: 'md', class: 'w-[480px]' },
      { side: ['left', 'right'], size: 'lg', class: 'w-[640px]' },
      { side: ['left', 'right'], size: 'xl', class: 'w-[800px]' },
      { side: ['top', 'bottom'], size: 'sm', class: 'h-[280px]' },
      { side: ['top', 'bottom'], size: 'md', class: 'h-[400px]' },
      { side: ['top', 'bottom'], size: 'lg', class: 'h-[70vh]' },
      { side: ['top', 'bottom'], size: 'xl', class: 'h-[85vh]' },
    ],
    defaultVariants: {
      side: 'right',
      size: 'md',
    },
  },
);

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  hideCloseButton?: boolean;
}

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side, size, hideCloseButton, className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side, size }), className)}
      {...props}
    >
      {children}
      {!hideCloseButton ? (
        <DialogPrimitive.Close
          className={cn(
            'absolute right-4 top-4',
            'flex size-11 items-center justify-center',
            'rounded-[var(--radius-md)]',
            'text-[var(--color-rrt-text-soft)]',
            'hover:bg-[var(--color-rrt-surface-hover)]',
            'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
          )}
          aria-label="Close"
        >
          <X aria-hidden="true" className="size-5" />
        </DialogPrimitive.Close>
      ) : null}
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = 'SheetContent';

export function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-1 text-left', className)} {...props} />
  );
}

export function SheetFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}

export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'font-display text-[var(--text-h2)] leading-[var(--text-h2--line-height)] tracking-[var(--text-h2--letter-spacing)]',
      'text-[var(--color-rrt-text)]',
      className,
    )}
    {...props}
  />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      'text-[var(--text-body-sm)] text-[var(--color-rrt-text-soft)]',
      className,
    )}
    {...props}
  />
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;
