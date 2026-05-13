import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '../../lib/utils';

/**
 * Dialog - modal-blocking overlay for confirmations and short flows.
 *
 * Reference: docs/spec/01-design-system.md §3.7
 *
 * Radix-handled: focus trap on open, focus returns to trigger on close,
 * escape closes, click-outside closes, body scroll locked.
 *
 * @example
 *   <Dialog open={open} onOpenChange={setOpen}>
 *     <DialogContent size="md">
 *       <DialogHeader>
 *         <DialogTitle>Confirm enrollment</DialogTitle>
 *         <DialogDescription>This will create a Family record.</DialogDescription>
 *       </DialogHeader>
 *       <DialogFooter>
 *         <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
 *         <Button>Confirm</Button>
 *       </DialogFooter>
 *     </DialogContent>
 *   </Dialog>
 */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export type DialogSize = 'sm' | 'md' | 'lg';

const dialogSizeClass: Record<DialogSize, string> = {
  sm: 'max-w-[400px]',
  md: 'max-w-[560px]',
  lg: 'max-w-[720px]',
};

export const DialogOverlay = React.forwardRef<
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
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: DialogSize;
  hideCloseButton?: boolean;
}

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, size = 'md', hideCloseButton = false, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50',
        'w-full translate-x-[-50%] translate-y-[-50%]',
        'grid gap-4 p-6',
        'bg-[var(--color-rrt-surface)] text-[var(--color-rrt-text)]',
        'border border-[var(--color-rrt-line)]',
        'rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)]',
        'duration-[var(--motion-duration-normal)]',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        dialogSizeClass[size],
        className,
      )}
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
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col gap-1 text-left', className)}
      {...props}
    />
  );
}
DialogHeader.displayName = 'DialogHeader';

export function DialogFooter({
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
DialogFooter.displayName = 'DialogFooter';

export const DialogTitle = React.forwardRef<
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
DialogTitle.displayName = DialogPrimitive.Title.displayName;

export const DialogDescription = React.forwardRef<
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
DialogDescription.displayName = DialogPrimitive.Description.displayName;
