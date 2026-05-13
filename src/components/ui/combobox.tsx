import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '../../lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';

/**
 * Combobox - searchable single-select. shadcn pattern = Command inside Popover.
 *
 * Reference: docs/spec/01-design-system.md §3.4
 *
 * Used in: trial booking class picker, staff override student search,
 * Family search in Cmd-K palette.
 *
 * @example
 *   <Combobox
 *     value={programId}
 *     onChange={setProgramId}
 *     options={[
 *       { value: 'preschool', label: 'Preschool' },
 *       { value: 'beginners', label: 'Beginners' },
 *     ]}
 *     placeholder="Pick a program"
 *     searchPlaceholder="Search programs..."
 *     emptyMessage="No programs match."
 *   />
 */
export interface ComboboxOption {
  value: string;
  label: string;
  /** Optional secondary label rendered in soft text */
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  value?: string | null;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  triggerClassName?: string;
  invalid?: boolean;
  disabled?: boolean;
  size?: 'md' | 'lg' | 'xl';
}

const triggerSizeClass: Record<'md' | 'lg' | 'xl', string> = {
  md: 'h-10 px-3 text-[var(--text-body-sm)]',
  lg: 'h-12 px-4 text-[var(--text-body)]',
  xl: 'h-14 px-5 text-[var(--text-body)]',
};

export function Combobox({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results.',
  triggerClassName,
  invalid,
  disabled,
  size = 'lg',
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const selected = value
    ? options.find((opt) => opt.value === value) ?? null
    : null;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid || undefined}
          disabled={disabled}
          className={cn(
            'inline-flex w-full items-center justify-between gap-2',
            'rounded-[var(--radius-lg)]',
            'bg-[var(--color-rrt-surface)] text-[var(--color-rrt-text)]',
            'border border-[var(--color-rrt-line)]',
            'hover:border-[var(--color-rrt-line-strong)]',
            'focus:outline-none focus-visible:shadow-[var(--shadow-focus)]',
            'aria-[invalid=true]:border-[var(--color-rrt-error)]',
            'disabled:opacity-55 disabled:cursor-not-allowed',
            triggerSizeClass[size],
            triggerClassName,
          )}
        >
          <span
            className={cn(
              'truncate',
              !selected && 'text-[var(--color-rrt-text-faint)]',
            )}
          >
            {selected ? selected.label : placeholder}
          </span>
          <ChevronsUpDown
            aria-hidden="true"
            className="size-4 shrink-0 opacity-60"
          />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className={cn(
            'z-50 w-[--radix-popover-trigger-width] p-0',
            'rounded-[var(--radius-lg)]',
            'border border-[var(--color-rrt-line)]',
            'bg-[var(--color-rrt-surface)] text-[var(--color-rrt-text)]',
            'shadow-[var(--shadow-lg)]',
          )}
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    disabled={opt.disabled}
                    onSelect={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      aria-hidden="true"
                      className={cn(
                        'mr-2 size-4',
                        opt.value === value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    <span className="flex-1">
                      {opt.label}
                      {opt.description ? (
                        <span className="ml-1 text-[var(--color-rrt-text-soft)]">
                          {opt.description}
                        </span>
                      ) : null}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
