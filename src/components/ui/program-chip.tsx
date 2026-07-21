import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';
import { programTones, type ProgramId } from '../../lib/tokens';

/**
 * ProgramChip - the ONLY legal way to render a program tone.
 *
 * Reference: docs/spec/01-design-system.md §3.13
 *
 * Per critique 04 Failure 1 on Concept C (WCAG 1.4.1 Use of Color):
 *   - Every chip MUST render the 2-letter program prefix as text.
 *   - Color-blind users see `BG` regardless of whether they can distinguish
 *     sage from mauve.
 *
 * A chip rendered without a known `programId` falls back to the fallback
 * tone (prefix `—`) and logs a console warning in dev.
 *
 * @example
 *   <ProgramChip programId="preschool" />              // "PS"
 *   <ProgramChip programId="ballet" withName />        // "BA · Ballet"
 *   <ProgramChip programId="beginners" size="sm" />    // small "BG"
 */
const chipVariants = cva(
  [
    'inline-flex items-center gap-1.5',
    'rounded-[var(--radius-md)]',
    'font-sans font-semibold',
    'whitespace-nowrap',
    'border',
  ],
  {
    variants: {
      size: {
        sm: 'h-5 px-2 [font-size:var(--text-caption)]',
        md: 'h-7 px-2.5 [font-size:var(--text-body-sm)]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface ProgramChipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>,
    VariantProps<typeof chipVariants> {
  programId: ProgramId | (string & {});
  withName?: boolean;
}

export const ProgramChip = React.forwardRef<HTMLSpanElement, ProgramChipProps>(
  ({ className, size, programId, withName, ...props }, ref) => {
    const isKnown = (Object.keys(programTones) as string[]).includes(programId);
    if (!isKnown && process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        `[ProgramChip] Unknown programId "${programId}" - falling back to neutral tone. Use one of: ${Object.keys(programTones).join(', ')}.`,
      );
    }
    const tone = isKnown
      ? programTones[programId as ProgramId]
      : programTones.fallback;
    return (
      <span
        ref={ref}
        className={cn(chipVariants({ size }), className)}
        style={{
          backgroundColor: tone.bg,
          color: tone.text,
          borderColor: tone.border,
        }}
        {...props}
      >
        <span className="font-bold tracking-wide">{tone.prefix}</span>
        {withName ? (
          <>
            <span aria-hidden="true" className="opacity-50">
              ·
            </span>
            <span>{tone.label}</span>
          </>
        ) : null}
      </span>
    );
  },
);
ProgramChip.displayName = 'ProgramChip';
