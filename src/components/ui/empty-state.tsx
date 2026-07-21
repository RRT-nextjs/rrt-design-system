import * as React from 'react';
import { Calendar, Inbox, Search } from 'lucide-react';

import { cn } from '../../lib/utils';
import { RibbonMark } from '../ribbon-mark';

/**
 * EmptyState - "No results" / "No data yet" state.
 *
 * Reference: docs/spec/01-design-system.md §3.25
 *
 * Pattern: short heading, one-sentence subline, one optional CTA.
 *
 * @example
 *   <EmptyState
 *     illustration="ribbon"
 *     title="Inbox is clear"
 *     description="When a parent books a trial on the website, it lands here."
 *   />
 *   <EmptyState
 *     illustration="search"
 *     title="Nothing matches 'Sienna'"
 *     description="Try a different name or check the spelling."
 *   />
 */
export type EmptyStateIllustration = 'ribbon' | 'inbox' | 'calendar' | 'search';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  illustration?: EmptyStateIllustration;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

function IllustrationFor({ kind }: { kind: EmptyStateIllustration }) {
  switch (kind) {
    case 'inbox':
      return (
        <Inbox
          aria-hidden="true"
          className="size-20 text-[var(--color-rrt-maroon-300)]"
          strokeWidth={1.25}
        />
      );
    case 'calendar':
      return (
        <Calendar
          aria-hidden="true"
          className="size-20 text-[var(--color-rrt-maroon-300)]"
          strokeWidth={1.25}
        />
      );
    case 'search':
      return (
        <Search
          aria-hidden="true"
          className="size-20 text-[var(--color-rrt-maroon-300)]"
          strokeWidth={1.25}
        />
      );
    case 'ribbon':
    default:
      return <RibbonMark size={80} tone="maroon" />;
  }
}

export function EmptyState({
  className,
  illustration = 'ribbon',
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'gap-6 p-12',
        'bg-[var(--color-rrt-surface)]',
        'rounded-[var(--radius-xl)]',
        'border border-[var(--color-rrt-line)]',
        className,
      )}
      {...props}
    >
      <IllustrationFor kind={illustration} />
      <div className="flex flex-col gap-2 max-w-prose">
        <h3 className="font-display [font-size:var(--text-h3)] text-[var(--color-rrt-text)]">
          {title}
        </h3>
        {description ? (
          <p className="[font-size:var(--text-body)] text-[var(--color-rrt-text-soft)]">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <button
          type="button"
          onClick={action.onClick}
          className={cn(
            'inline-flex items-center justify-center',
            'h-12 px-5 rounded-[var(--radius-lg)]',
            'bg-[var(--color-rrt-maroon-800)] text-[var(--color-rrt-cream-50)]',
            '[font-size:var(--text-body)] font-semibold',
            'hover:bg-[var(--color-rrt-maroon-700)]',
            'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
          )}
        >
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
