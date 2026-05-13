import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { AlertCircle } from 'lucide-react';

import { cn } from '../../lib/utils';

/**
 * FormField - wrapper that pairs Label + Input + Error message + Description.
 * Required around every Input/Select/Textarea/Combobox.
 *
 * Reference: docs/spec/01-design-system.md §3.20
 *
 * Auto-generates ids and aria-describedby linking input <-> error/description.
 * Error has role="alert" so screen readers announce on appearance.
 *
 * @example
 *   <FormField label="Email" required description="We'll send class updates here.">
 *     <Input type="email" name="email" />
 *   </FormField>
 *   <FormField label="PIN" error="PIN not recognized.">
 *     <Input type="text" inputMode="numeric" />
 *   </FormField>
 */
export interface FormFieldProps {
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  hideLabel?: boolean;
  className?: string;
  children: React.ReactElement;
  id?: string;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      label,
      description,
      error,
      required,
      hideLabel,
      className,
      children,
      id: providedId,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();
    const id = providedId ?? `field-${reactId}`;
    const descriptionId = `${id}-description`;
    const errorId = `${id}-error`;
    const ariaDescribedBy =
      [description ? descriptionId : null, error ? errorId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    // Inject id + aria-* into the input child.
    const childWithProps = React.cloneElement(
      children as React.ReactElement<Record<string, unknown>>,
      {
        id,
        'aria-describedby': ariaDescribedBy,
        'aria-invalid': error ? true : undefined,
        'aria-required': required || undefined,
      } as Record<string, unknown>,
    );

    return (
      <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props}>
        <LabelPrimitive.Root
          htmlFor={id}
          className={cn(
            'text-[var(--text-body-sm)] font-semibold',
            'text-[var(--color-rrt-text-soft)]',
            hideLabel && 'sr-only',
          )}
        >
          {label}
          {required ? (
            <span
              aria-hidden="true"
              className="ml-1 text-[var(--color-rrt-error)]"
            >
              *
            </span>
          ) : null}
        </LabelPrimitive.Root>
        {childWithProps}
        {error ? (
          <p
            id={errorId}
            role="alert"
            className={cn(
              'inline-flex items-center gap-1.5',
              'text-[var(--text-body-sm)] text-[var(--color-rrt-error)]',
            )}
          >
            <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
            <span>{error}</span>
          </p>
        ) : description ? (
          <p
            id={descriptionId}
            className="text-[var(--text-caption)] text-[var(--color-rrt-text-faint)]"
          >
            {description}
          </p>
        ) : null}
      </div>
    );
  },
);
FormField.displayName = 'FormField';
