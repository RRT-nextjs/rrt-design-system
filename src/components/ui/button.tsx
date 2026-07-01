import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2, type LucideIcon } from 'lucide-react';

import { cn } from '../../lib/utils';

/**
 * Button - primary interactive control.
 *
 * Reference: docs/spec/01-design-system.md §3.1
 *
 * @example
 *   <Button variant="primary" size="lg" onClick={handleSave}>Save</Button>
 *   <Button variant="secondary" icon={Plus}>Add student</Button>
 *   <Button variant="primary" loading loadingText="Saving">Save</Button>
 *   <Button asChild><Link href="/admin">Open admin</Link></Button>
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-sans font-semibold',
    'rounded-[var(--radius-lg)]',
    'transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-out)]',
    'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
    'disabled:opacity-55 disabled:cursor-not-allowed',
    'aria-disabled:opacity-55 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none',
    '[&_svg]:shrink-0 [&_svg]:size-[var(--icon-size-md)]',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-[var(--color-rrt-maroon-800)] text-[var(--color-rrt-cream-50)]',
          'hover:bg-[var(--color-rrt-maroon-700)]',
          'active:bg-[var(--color-rrt-maroon-700)]',
        ],
        secondary: [
          'bg-[var(--color-rrt-surface)] text-[var(--color-rrt-maroon-700)]',
          'border border-[var(--color-rrt-line)]',
          'hover:bg-[var(--color-rrt-surface-hover)]',
        ],
        tertiary: [
          'bg-transparent text-[var(--color-rrt-maroon-700)]',
          'hover:underline underline-offset-4',
        ],
        ghost: [
          'bg-transparent text-[var(--color-rrt-text)]',
          'hover:bg-[var(--color-rrt-surface-hover)]',
        ],
        destructive: [
          'bg-[var(--color-rrt-error)] text-[var(--color-rrt-cream-50)]',
          'hover:opacity-90',
        ],
      },
      size: {
        // Use the property-arbitrary form for font-size below (the
        // [property:value] shape, e.g. h-8 px-3 followed by a font-size
        // arbitrary value) instead of the text-color-style form. The
        // shorter form is ambiguous to tailwind-merge (size vs color) and
        // collides with the variant's text-color class - the color gets
        // dropped, leaving primary buttons with inherited body text on
        // a dark maroon background. Note: this comment used to embed
        // those two forms inline as code-formatted strings, but Tailwind
        // v4's class extractor picked the ellipsis-placeholder versions
        // up as candidate classes, producing invalid `var(...)` rules
        // that `next dev` (Turbopack PostCSS) hard-fails on; the literal
        // tokens are removed so the comment is no longer extractor bait.
        sm: 'h-8 px-3 [font-size:var(--text-body-sm)]',
        md: 'h-10 px-4 [font-size:var(--text-body-sm)]',
        lg: 'h-12 px-5 [font-size:var(--text-body)]',
        xl: 'h-14 px-6 [font-size:var(--text-body)]',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
      fullWidth: false,
    },
  },
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'leading' | 'trailing';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      loadingText,
      disabled = false,
      icon: Icon,
      iconPosition = 'leading',
      children,
      type = 'button',
      // Destructured OUT of props so the `{...props}` spread below can never
      // overwrite the guarded handler. Previously onClick stayed inside props
      // and the spread (declared after the guard) silently replaced it - a
      // Button with `disabled` + `onClick` still fired on activation. Mouse
      // clicks were masked by aria-disabled:pointer-events-none, but the
      // button stays FOCUSABLE by design, so keyboard Enter/Space reached the
      // un-guarded handler.
      onClick,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isInactive = loading || disabled;

    // When asChild, Slot expects exactly one child element. Compose loading
    // and icon into a single fragment.
    const content = (
      <>
        {loading ? (
          <Loader2
            aria-hidden="true"
            className="animate-spin"
            style={{ animationDuration: '1.2s' }}
          />
        ) : (
          Icon && iconPosition === 'leading' ? <Icon aria-hidden="true" /> : null
        )}
        <span>{loading && loadingText ? loadingText : children}</span>
        {!loading && Icon && iconPosition === 'trailing' ? <Icon aria-hidden="true" /> : null}
      </>
    );

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        aria-disabled={isInactive || undefined}
        aria-busy={loading || undefined}
        aria-live={loading && loadingText ? 'polite' : undefined}
        // We use aria-disabled (not the HTML disabled attr) so screen readers
        // can still focus and read why the button is unavailable. See §3.1
        // and §4.4 in the design system spec. The spread comes FIRST so no
        // props key can override the guard; onClick is destructured out above.
        {...props}
        onClick={(e) => {
          if (isInactive) {
            e.preventDefault();
            return;
          }
          onClick?.(e);
        }}
      >
        {content}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };
