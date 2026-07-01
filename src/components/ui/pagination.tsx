import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '../../lib/utils';

/**
 * Pagination - page-by-page navigation for long lists (Reports, audit log).
 *
 * Reference: docs/spec/01-design-system.md §3.24
 *
 * role="navigation" with aria-label="Pagination". Current page has
 * aria-current="page".
 *
 * @example
 *   <Pagination page={3} pageCount={20} onPageChange={setPage} />
 */
export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

/**
 * Build the page range for pagination display.
 * Returns a mix of numbers and the string 'ellipsis' for gaps.
 */
function buildRange(
  page: number,
  pageCount: number,
  siblingCount: number,
): Array<number | 'ellipsis'> {
  const totalSlots = siblingCount * 2 + 5; // 1 + 1 + siblingCount*2 + 1 (first, last, current, siblings, current)
  if (pageCount <= totalSlots) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(2, page - siblingCount);
  const rightSibling = Math.min(pageCount - 1, page + siblingCount);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < pageCount - 1;

  const result: Array<number | 'ellipsis'> = [1];
  if (showLeftEllipsis) result.push('ellipsis');
  for (let i = leftSibling; i <= rightSibling; i++) result.push(i);
  if (showRightEllipsis) result.push('ellipsis');
  result.push(pageCount);
  return result;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  const range = buildRange(page, pageCount, siblingCount);
  const canPrev = page > 1;
  const canNext = page < pageCount;

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      <button
        type="button"
        onClick={() => canPrev && onPageChange(page - 1)}
        disabled={!canPrev}
        aria-label="Go to previous page"
        className={cn(
          'inline-flex items-center justify-center',
          'h-10 w-10 rounded-[var(--radius-md)]',
          'text-[var(--color-rrt-text)]',
          'hover:bg-[var(--color-rrt-surface-hover)]',
          'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
          'disabled:opacity-40 disabled:cursor-not-allowed',
        )}
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
      </button>
      {range.map((item, idx) =>
        item === 'ellipsis' ? (
          <span
            key={`ellipsis-${idx}`}
            aria-hidden="true"
            className="inline-flex h-10 w-10 items-center justify-center text-[var(--color-rrt-text-soft)]"
          >
            <MoreHorizontal className="size-4" />
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === page ? 'page' : undefined}
            aria-label={`Go to page ${item}`}
            className={cn(
              'inline-flex items-center justify-center',
              'h-10 min-w-10 px-2 rounded-[var(--radius-md)]',
              'text-[var(--text-body-sm)] font-semibold',
              'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
              item === page
                ? 'bg-[var(--color-rrt-maroon-700)] text-[var(--color-rrt-cream-50)]'
                : 'text-[var(--color-rrt-text)] hover:bg-[var(--color-rrt-surface-hover)]',
            )}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => canNext && onPageChange(page + 1)}
        disabled={!canNext}
        aria-label="Go to next page"
        className={cn(
          'inline-flex items-center justify-center',
          'h-10 w-10 rounded-[var(--radius-md)]',
          'text-[var(--color-rrt-text)]',
          'hover:bg-[var(--color-rrt-surface-hover)]',
          'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
          'disabled:opacity-40 disabled:cursor-not-allowed',
        )}
      >
        <ChevronRight aria-hidden="true" className="size-4" />
      </button>
    </nav>
  );
}
