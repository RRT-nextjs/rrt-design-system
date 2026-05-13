import * as React from 'react';

import { cn } from '../lib/utils';

/**
 * RibbonMark - the RRT brand mark. Three tones, six standard sizes.
 *
 * Reference: docs/spec/01-design-system.md §3.30
 *
 * @example
 *   <RibbonMark size={32} tone="maroon" />
 *   <RibbonMark size={96} tone="cream" />
 *   <RibbonMark size={56} tone="gold" />
 */
export type RibbonTone = 'maroon' | 'cream' | 'gold';

export interface RibbonMarkProps extends Omit<React.SVGProps<SVGSVGElement>, 'fill' | 'stroke'> {
  /** Pixel size, applied to both width and height */
  size?: 24 | 32 | 56 | 96 | 120 | 160 | number;
  /** Color tone for the mark */
  tone?: RibbonTone;
  /** Accessibility label; if omitted, the mark is rendered aria-hidden */
  title?: string;
}

const toneColor: Record<RibbonTone, string> = {
  maroon: 'var(--color-rrt-maroon-700)',
  cream: 'var(--color-rrt-cream-50)',
  gold: 'var(--color-rrt-gold-500)',
};

export const RibbonMark = React.forwardRef<SVGSVGElement, RibbonMarkProps>(
  ({ size = 32, tone = 'maroon', title, className, ...props }, ref) => {
    const color = toneColor[tone];
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role={title ? 'img' : undefined}
        aria-hidden={title ? undefined : true}
        aria-label={title}
        className={cn('shrink-0', className)}
        {...props}
      >
        {title ? <title>{title}</title> : null}
        {/* A stylized ribbon arc: a sweeping curve that doubles back, evoking
         * the rhythmic gymnastics ribbon. Two strokes give a sense of motion
         * without animating. */}
        <path
          d="M8 48 C 16 24, 40 24, 56 8"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M8 56 C 24 36, 48 36, 56 16"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.5}
          fill="none"
        />
      </svg>
    );
  },
);
RibbonMark.displayName = 'RibbonMark';
