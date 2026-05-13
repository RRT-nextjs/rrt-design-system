import * as React from 'react';

import { cn } from '../lib/utils';
import { RibbonMark, type RibbonTone } from './ribbon-mark';

/**
 * Wordmark - "Rhythmic Ribbon of Texas" lockup with the brand mark.
 *
 * Reference: docs/spec/01-design-system.md §3.31
 *
 * Two variants: stacked (logo above wordmark, kiosk + login) and inline
 * (wordmark beside the logo, header bar).
 *
 * @example
 *   <Wordmark variant="inline" tone="maroon" />
 *   <Wordmark variant="stacked" tone="cream" />
 */
export interface WordmarkProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'inline' | 'stacked';
  tone?: RibbonTone;
  markSize?: number;
  title?: string;
}

export const Wordmark = React.forwardRef<HTMLSpanElement, WordmarkProps>(
  (
    {
      variant = 'inline',
      tone = 'maroon',
      markSize,
      title = 'Rhythmic Ribbon of Texas',
      className,
      ...props
    },
    ref,
  ) => {
    const toneClass =
      tone === 'cream'
        ? 'text-[var(--color-rrt-cream-50)]'
        : tone === 'gold'
          ? 'text-[var(--color-rrt-gold-500)]'
          : 'text-[var(--color-rrt-maroon-700)]';

    const computedMarkSize = markSize ?? (variant === 'stacked' ? 56 : 32);

    return (
      <span
        ref={ref}
        role="img"
        aria-label={title}
        className={cn(
          variant === 'stacked'
            ? 'inline-flex flex-col items-center gap-2'
            : 'inline-flex items-center gap-2.5',
          toneClass,
          className,
        )}
        {...props}
      >
        <RibbonMark
          size={computedMarkSize as 24 | 32 | 56 | 96 | 120 | 160}
          tone={tone}
        />
        <span
          aria-hidden="true"
          className={cn(
            'font-display font-medium',
            variant === 'stacked' ? 'text-[var(--text-h3)]' : 'text-[var(--text-h4)]',
          )}
        >
          Rhythmic Ribbon of Texas
        </span>
      </span>
    );
  },
);
Wordmark.displayName = 'Wordmark';
