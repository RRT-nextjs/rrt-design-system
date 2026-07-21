import * as React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { cn } from '../../lib/utils';

/**
 * Table - bespoke composition on top of HTML <table>. Not virtualized (200
 * students fits comfortably). Virtualization deferred until Phase 5 scale
 * demands it (Slice 8+).
 *
 * Reference: docs/spec/01-design-system.md §3.17
 *
 * @example
 *   <Table>
 *     <TableHeader>
 *       <TableRow>
 *         <TableHead>Name</TableHead>
 *         <TableHead sortable sortState="asc">Class</TableHead>
 *       </TableRow>
 *     </TableHeader>
 *     <TableBody>
 *       <TableRow clickable onClick={() => router.push('...')}>
 *         <TableCell>Mia A.</TableCell>
 *         <TableCell>Beginners 4:30</TableCell>
 *       </TableRow>
 *     </TableBody>
 *   </Table>
 */
export const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & { caption?: string }
>(({ className, caption, children, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn(
        'w-full caption-bottom',
        '[font-size:var(--text-body-sm)]',
        'border-collapse',
        className,
      )}
      {...props}
    >
      {caption ? (
        <caption className="mt-4 [font-size:var(--text-body-sm)] text-[var(--color-rrt-text-soft)]">
          {caption}
        </caption>
      ) : null}
      {children}
    </table>
  </div>
));
Table.displayName = 'Table';

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      'border-b border-[var(--color-rrt-line-strong)]',
      'bg-[var(--color-rrt-surface)]',
      className,
    )}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t border-[var(--color-rrt-line)]',
      'bg-[var(--color-rrt-surface-hover)] font-semibold',
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  clickable?: boolean;
  selected?: boolean;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, clickable, selected, onClick, ...props }, ref) => (
    <tr
      ref={ref}
      data-clickable={clickable || undefined}
      data-state={selected ? 'selected' : undefined}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (clickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.(e as unknown as React.MouseEvent<HTMLTableRowElement>);
        }
        props.onKeyDown?.(e);
      }}
      className={cn(
        'border-b border-[var(--color-rrt-line)] transition-colors',
        clickable && 'cursor-pointer hover:bg-[var(--color-rrt-surface-hover)]',
        clickable &&
          'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
        'data-[state=selected]:bg-[var(--color-rrt-surface-hover)]',
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = 'TableRow';

export type SortState = 'asc' | 'desc' | 'none';

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortState?: SortState;
  onSort?: () => void;
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable, sortState = 'none', onSort, children, ...props }, ref) => {
    const ariaSort: 'ascending' | 'descending' | 'none' | undefined = sortable
      ? sortState === 'asc'
        ? 'ascending'
        : sortState === 'desc'
          ? 'descending'
          : 'none'
      : undefined;
    const Icon =
      sortState === 'asc' ? ArrowUp : sortState === 'desc' ? ArrowDown : ArrowUpDown;
    return (
      <th
        ref={ref}
        aria-sort={ariaSort}
        className={cn(
          'h-12 px-4 text-left align-middle',
          '[font-size:var(--text-body-sm)] font-semibold',
          'text-[var(--color-rrt-text-soft)]',
          className,
        )}
        {...props}
      >
        {sortable ? (
          <button
            type="button"
            onClick={onSort}
            className={cn(
              'inline-flex items-center gap-1',
              'text-[var(--color-rrt-text-soft)] hover:text-[var(--color-rrt-text)]',
              'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
              'rounded-[var(--radius-sm)] px-1',
            )}
          >
            <span>{children}</span>
            <Icon aria-hidden="true" className="size-3.5 opacity-70" />
          </button>
        ) : (
          children
        )}
      </th>
    );
  },
);
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'p-4 align-middle',
      'text-[var(--color-rrt-text)]',
      className,
    )}
    {...props}
  />
));
TableCell.displayName = 'TableCell';
