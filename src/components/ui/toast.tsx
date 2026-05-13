import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react';

import { cn } from '../../lib/utils';

/**
 * Toast - non-blocking confirmation, error notification, undo affordance.
 *
 * Reference: docs/spec/01-design-system.md §3.9
 *
 * Error toasts default to 8000ms (5000ms standard). Stacking max 3 visible
 * at once. Each variant ships an icon glyph so success/error are not encoded
 * by color alone (WCAG 1.4.1).
 *
 * @example
 *   <ToastProvider>
 *     <YourApp />
 *     <ToastViewport />
 *   </ToastProvider>
 *   // somewhere:
 *   const { toast } = useToast();
 *   toast({ variant: 'success', title: 'Mia & Lily checked in' });
 */
export const ToastProvider = ToastPrimitives.Provider;

export const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-50 flex max-h-screen w-full flex-col-reverse p-4',
      'sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col',
      'sm:max-w-[420px]',
      'gap-2',
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  [
    'group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden',
    'rounded-[var(--radius-lg)] border p-4 pr-8',
    'shadow-[var(--shadow-md)]',
    'transition-all',
    'data-[swipe=cancel]:translate-x-0',
    'data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
    'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
    'data-[swipe=move]:transition-none',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full',
    'data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  ],
  {
    variants: {
      variant: {
        success: [
          'bg-[var(--color-rrt-success-bg)] text-[var(--color-rrt-success)]',
          'border-[var(--color-rrt-success)]',
        ],
        warning: [
          'bg-[var(--color-rrt-warning-bg)] text-[var(--color-rrt-warning)]',
          'border-[var(--color-rrt-warning)]',
        ],
        error: [
          'bg-[var(--color-rrt-error-bg)] text-[var(--color-rrt-error)]',
          'border-[var(--color-rrt-error)]',
        ],
        info: [
          'bg-[var(--color-rrt-info-bg)] text-[var(--color-rrt-info)]',
          'border-[var(--color-rrt-info)]',
        ],
        neutral: [
          'bg-[var(--color-rrt-surface-hover)] text-[var(--color-rrt-text)]',
          'border-[var(--color-rrt-line)]',
        ],
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);

export type ToastVariant = NonNullable<VariantProps<typeof toastVariants>['variant']>;

const variantIcon = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
  neutral: null,
} as const;

const variantRole = {
  success: 'status' as const,
  info: 'status' as const,
  neutral: 'status' as const,
  warning: 'alert' as const,
  error: 'alert' as const,
};

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
    VariantProps<typeof toastVariants> {}

export const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ className, variant = 'neutral', children, ...props }, ref) => {
  const Icon = variant ? variantIcon[variant] : null;
  return (
    <ToastPrimitives.Root
      ref={ref}
      role={variant ? variantRole[variant] : 'status'}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      {Icon ? (
        <Icon aria-hidden="true" className="size-5 shrink-0 mt-0.5" />
      ) : null}
      <div className="flex-1">{children}</div>
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

export const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-9 shrink-0 items-center justify-center',
      'rounded-[var(--radius-md)] border border-current',
      'bg-transparent px-3 text-[var(--text-body-sm)] font-semibold',
      'hover:opacity-90',
      'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

export const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-[var(--radius-md)] p-1',
      'opacity-70 transition-opacity hover:opacity-100',
      'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
      className,
    )}
    aria-label="Close"
    toast-close=""
    {...props}
  >
    <X aria-hidden="true" className="size-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

export const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-[var(--text-body-sm)] font-semibold', className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

export const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-[var(--text-body-sm)] opacity-90', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;
