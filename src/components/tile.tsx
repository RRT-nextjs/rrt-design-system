import * as React from 'react';
import { Check } from 'lucide-react';

import { cn } from '../lib/utils';
import type { ProgramId } from '../lib/tokens';
import {
  Avatar,
  type AvatarFlag,
  type AvatarStatus,
  type AvatarSurface,
} from './avatar';

/**
 * Tile - the kiosk-grade tappable identity card. Avatar with surrounding
 * caption strip.
 *
 * Reference: docs/spec/01-design-system.md §3.6
 *
 * Used on: kiosk roster (220pt), coach roster (96-120pt), front-desk
 * "Arriving Next" rail (80pt), Students CRM grid view (96pt).
 *
 * The ENTIRE tile is the tap target (never just the avatar within). 96pt
 * minimum at `compact`, 220pt at `kiosk` (well above WCAG 2.5.5 AAA 44pt).
 *
 * @example
 *   <Tile
 *     size="kiosk"
 *     surface="kiosk"
 *     name="Mia Aaronson"
 *     primaryLabel="Mia A."
 *     secondaryLabel="4:30 BG"
 *     photoUrl="/m.webp"
 *     photoConsent={true}
 *     onSelect={() => toggleSelect('mia')}
 *     selected={isSelected}
 *   />
 *   <Tile
 *     size="compact"
 *     surface="frontdesk"
 *     name="Lily"
 *     primaryLabel="Lily"
 *     secondaryLabel="Arriving in 8m"
 *     status="pending"
 *   />
 */
export type TileSize = 'compact' | 'comfortable' | 'kiosk';

export interface TileProps {
  name: string;
  firstName?: string;
  photoUrl?: string | null;
  photoConsent?: boolean;
  programId?: ProgramId | string | null;
  status?: AvatarStatus;
  flag?: AvatarFlag;
  size: TileSize;
  surface?: AvatarSurface;
  primaryLabel: string;
  secondaryLabel?: string;
  selected?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
  disabledReason?: string;
  cacheKey?: string;
  className?: string;
}

const sizeConfig: Record<
  TileSize,
  {
    avatarSize: 80 | 96 | 220;
    primaryClass: string;
    secondaryClass: string;
    tileHeight: number;
    padding: string;
  }
> = {
  compact: {
    avatarSize: 80,
    primaryClass: 'text-[var(--text-body-sm)]',
    secondaryClass: 'text-[var(--text-caption)]',
    tileHeight: 144,
    padding: 'p-2',
  },
  comfortable: {
    avatarSize: 96,
    primaryClass: 'text-[var(--text-body)]',
    secondaryClass: 'text-[var(--text-body-sm)]',
    tileHeight: 176,
    padding: 'p-3',
  },
  kiosk: {
    avatarSize: 220,
    primaryClass: 'text-[var(--text-h3)] font-display',
    secondaryClass: 'text-[var(--text-body)]',
    tileHeight: 280,
    padding: 'p-4',
  },
};

export const Tile = React.forwardRef<HTMLButtonElement, TileProps>(
  (
    {
      name,
      firstName,
      photoUrl,
      photoConsent,
      programId,
      status,
      flag,
      size,
      surface = 'admin',
      primaryLabel,
      secondaryLabel,
      selected = false,
      onSelect,
      disabled = false,
      disabledReason,
      cacheKey,
      className,
    },
    ref,
  ) => {
    const cfg = sizeConfig[size];
    const interactive = Boolean(onSelect) && !disabled;

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || !onSelect}
        aria-pressed={onSelect ? selected : undefined}
        aria-disabled={disabled || undefined}
        onClick={interactive ? onSelect : undefined}
        className={cn(
          'flex flex-col items-center gap-3',
          'rounded-[var(--radius-2xl)]',
          'bg-[var(--color-rrt-surface)]',
          'border border-[var(--color-rrt-line)]',
          'transition-all duration-[var(--motion-duration-fast)]',
          cfg.padding,
          interactive &&
            'cursor-pointer hover:bg-[var(--color-rrt-surface-hover)] hover:shadow-[var(--shadow-sm)]',
          interactive &&
            'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
          selected &&
            'ring-4 ring-inset ring-[var(--color-rrt-maroon-700)] bg-[var(--color-rrt-surface)]',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
        style={{ minHeight: cfg.tileHeight }}
      >
        <div className="relative">
          <Avatar
            name={name}
            firstName={firstName}
            photoUrl={photoUrl}
            photoConsent={photoConsent}
            programId={programId}
            size={cfg.avatarSize}
            status={status}
            flag={flag}
            surface={surface}
            cacheKey={cacheKey}
          />
          {selected ? (
            <span
              aria-hidden="true"
              className={cn(
                'absolute -bottom-1 -right-1',
                'flex items-center justify-center',
                'rounded-full',
                'bg-[var(--color-rrt-maroon-700)] text-[var(--color-rrt-cream-50)]',
                'border-2 border-[var(--color-rrt-surface)]',
              )}
              style={{
                width: Math.max(24, Math.round(cfg.avatarSize * 0.22)),
                height: Math.max(24, Math.round(cfg.avatarSize * 0.22)),
              }}
            >
              <Check
                className="size-4"
                aria-hidden="true"
              />
            </span>
          ) : null}
        </div>
        <div className="flex flex-col items-center gap-0.5 text-center">
          <span className={cn(cfg.primaryClass, 'text-[var(--color-rrt-text)]')}>
            {primaryLabel}
          </span>
          {secondaryLabel ? (
            <span
              className={cn(
                cfg.secondaryClass,
                'text-[var(--color-rrt-text-soft)]',
              )}
            >
              {secondaryLabel}
            </span>
          ) : null}
          {disabled && disabledReason ? (
            <span
              className={cn(
                cfg.secondaryClass,
                'text-[var(--color-rrt-text-faint)]',
              )}
            >
              {disabledReason}
            </span>
          ) : null}
        </div>
      </button>
    );
  },
);
Tile.displayName = 'Tile';

/**
 * TileSkeleton - cream-tinted skeleton placeholder while data loads.
 * Use as the Suspense fallback for tile grids.
 */
export function TileSkeleton({
  size,
  className,
}: {
  size: TileSize;
  className?: string;
}) {
  const cfg = sizeConfig[size];
  return (
    <div
      aria-busy="true"
      role="status"
      className={cn(
        'flex flex-col items-center gap-3',
        'rounded-[var(--radius-2xl)]',
        'bg-[var(--color-rrt-surface-hover)]',
        'border border-[var(--color-rrt-line)]',
        'animate-pulse',
        cfg.padding,
        className,
      )}
      style={{ minHeight: cfg.tileHeight }}
    >
      <span
        className="rounded-full bg-[var(--color-rrt-line)]"
        style={{ width: cfg.avatarSize, height: cfg.avatarSize }}
      />
      <span className="h-3 w-3/4 rounded bg-[var(--color-rrt-line)]" />
      <span className="h-2.5 w-1/2 rounded bg-[var(--color-rrt-line)]" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
