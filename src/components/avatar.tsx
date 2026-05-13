import * as React from 'react';
import { AlertTriangle, Check, Clock, Dot } from 'lucide-react';

import { cn, firstNameOf, initialsColorHash, initialsFor } from '../lib/utils';
import type { ProgramId } from '../lib/tokens';

/**
 * Avatar - the photo-OR-initials primitive. The core of the winning direction
 * (Graft C.1 from the synthesis).
 *
 * Reference: docs/spec/01-design-system.md §3.5 + §7
 *
 * Rules (load-bearing):
 *
 *   1. Photo loading lifecycle: skeleton -> crossfade on load -> silent
 *      fallback to initials on error.
 *
 *   2. COPPA gate: `photoConsent === false` means NEVER render the photo,
 *      regardless of `photoUrl`. The Avatar is the LAST LINE of defense; the
 *      data layer is primary. (§7.4)
 *
 *   3. Alt text rule: alt text is the FIRST NAME ONLY, never the full name.
 *      (§7.5 - privacy)
 *
 *   4. Status overlay is ALWAYS color + glyph + label (WCAG 1.4.1).
 *
 *   5. Flag overlay is NEVER rendered on the kiosk surface (privacy + safety).
 *
 *   6. Initials background uses the deterministic hash from `initialsColorHash`.
 *      All six output pairs are pre-audited at AAA contrast.
 *
 * @example
 *   <Avatar name="Mia Aaronson" size={96} programId="beginners" />
 *   <Avatar name="Mia" photoUrl="/m.webp" photoConsent={true} size={220} />
 *   <Avatar name="Lily" status="checked-in" size={120} />
 *   <Avatar name="Sam" photoConsent={false} photoUrl="/s.webp" size={96} />  // initials, photo ignored
 *
 *   // Deterministic hash sample (same name -> same color across renders):
 *   //   "Mia Aaronson"  -> always tone A
 *   //   "Lily Park"     -> always tone B
 *   //   "Sam Wong"      -> always tone C
 *   //   "Anna García"   -> always tone D
 *   //   "Owen Jones"    -> always tone E
 */
export type AvatarSize = 28 | 40 | 56 | 80 | 96 | 120 | 160 | 220;
export type AvatarStatus =
  | 'checked-in'
  | 'late'
  | 'absent'
  | 'pending'
  | 'needs-attention'
  | null;
export type AvatarFlag = 'waiver' | 'payment' | 'medical' | null;
export type AvatarSurface = 'kiosk' | 'admin' | 'coach' | 'frontdesk';

const sizeToFontPx: Record<AvatarSize, number> = {
  28: 12,
  40: 16,
  56: 22,
  80: 28,
  96: 32,
  120: 40,
  160: 56,
  220: 72,
};

const statusToken: Record<NonNullable<AvatarStatus>, { color: string; label: string }> = {
  'checked-in': {
    color: 'var(--color-rrt-status-checkedin)',
    label: 'checked in',
  },
  late: {
    color: 'var(--color-rrt-status-late)',
    label: 'arriving late',
  },
  absent: {
    color: 'var(--color-rrt-status-absent)',
    label: 'absent',
  },
  pending: {
    color: 'var(--color-rrt-status-pending)',
    label: 'not yet checked in',
  },
  'needs-attention': {
    color: 'var(--color-rrt-status-flag)',
    label: 'needs attention',
  },
};

function StatusGlyph({ status, size }: { status: NonNullable<AvatarStatus>; size: number }) {
  const cls = 'text-current';
  const dim = Math.max(10, Math.round(size * 0.5));
  const style = { width: dim, height: dim };
  switch (status) {
    case 'checked-in':
      return <Check aria-hidden="true" className={cls} style={style} />;
    case 'late':
      return <Clock aria-hidden="true" className={cls} style={style} />;
    case 'absent':
      return <Dot aria-hidden="true" className={cls} style={style} />;
    case 'pending':
      return <Dot aria-hidden="true" className={cls} style={style} />;
    case 'needs-attention':
      return <AlertTriangle aria-hidden="true" className={cls} style={style} />;
  }
}

export interface AvatarProps {
  /** Display name. Used to derive initials and alt text (first name only). */
  name: string;
  /** Override the alt-text first name. Defaults to first whitespace token of `name`. */
  firstName?: string;
  /** Optional photo URL. If absent, initials render. */
  photoUrl?: string | null;
  /** COPPA gate. If FALSE, the photo is NEVER rendered regardless of photoUrl. */
  photoConsent?: boolean;
  /** Program id used to colorize initials (sibling consistency). */
  programId?: ProgramId | string | null;
  /** Visual size in px - drives w/h and initials font size. */
  size: AvatarSize;
  /** Status overlay - color + glyph (WCAG 1.4.1: never color alone). */
  status?: AvatarStatus;
  /** Flag overlay (staff-only). Dropped if surface=kiosk. */
  flag?: AvatarFlag;
  /** Shape variant. */
  shape?: 'circle' | 'square';
  /** Surface context. Enforces kiosk-no-flag rule. */
  surface?: AvatarSurface;
  /** Click handler. If present, the avatar renders as a button. */
  onClick?: () => void;
  /** Tab index. */
  tabIndex?: number;
  /** Cache-busting key (e.g. `${familyId}-${photoUpdatedAt}`). */
  cacheKey?: string;
  /** Additional class names. */
  className?: string;
}

export const Avatar = React.forwardRef<HTMLElement, AvatarProps>(
  (
    {
      name,
      firstName,
      photoUrl,
      photoConsent = false,
      programId,
      size,
      status = null,
      flag = null,
      shape = 'circle',
      surface = 'admin',
      onClick,
      tabIndex,
      cacheKey,
      className,
    },
    ref,
  ) => {
    const displayFirstName = firstName ?? firstNameOf(name);
    const initials = initialsFor(name);
    const { backgroundColor, color } = initialsColorHash(name, programId);

    // COPPA gate: photo is ONLY rendered when consent is explicitly true.
    const showPhoto = Boolean(photoConsent === true && photoUrl);

    const [imgLoaded, setImgLoaded] = React.useState(false);
    const [imgError, setImgError] = React.useState(false);

    // Reset state when cache key changes (new photo uploaded).
    React.useEffect(() => {
      setImgLoaded(false);
      setImgError(false);
    }, [cacheKey, photoUrl]);

    const Tag = onClick ? 'button' : 'span';
    const rounded = shape === 'circle' ? 'rounded-full' : 'rounded-[var(--radius-xl)]';

    // Kiosk surface drops flag entirely (privacy).
    const renderedFlag = surface === 'kiosk' ? null : flag;

    const initialsFontPx = sizeToFontPx[size];

    return (
      <Tag
        ref={ref as React.Ref<HTMLButtonElement & HTMLSpanElement>}
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        tabIndex={tabIndex ?? (onClick ? 0 : undefined)}
        aria-label={onClick ? `Open ${displayFirstName}'s profile` : undefined}
        className={cn(
          'relative inline-flex items-center justify-center shrink-0',
          'overflow-visible',
          rounded,
          onClick &&
            'cursor-pointer transition-colors duration-[var(--motion-duration-fast)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
          className,
        )}
        style={{ width: size, height: size }}
      >
        {/* Initials layer (always rendered as the base / fallback) */}
        <span
          aria-hidden={showPhoto && imgLoaded && !imgError ? 'true' : undefined}
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            rounded,
            'font-sans font-semibold',
            'select-none',
          )}
          style={{
            backgroundColor,
            color,
            fontSize: initialsFontPx,
          }}
        >
          {initials}
        </span>

        {/* Photo layer (only rendered with valid consent + url, never on error) */}
        {showPhoto && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl ?? undefined}
            alt={displayFirstName}
            loading={size >= 120 ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={cn(
              'absolute inset-0 size-full object-cover',
              rounded,
              'transition-opacity duration-[var(--motion-duration-fast)]',
              imgLoaded ? 'opacity-100' : 'opacity-0',
            )}
          />
        ) : null}

        {/* Status ring + glyph (WCAG 1.4.1: ring color AND glyph) */}
        {status ? (
          <span
            role="img"
            aria-label={`${displayFirstName}, ${statusToken[status].label}`}
            className={cn(
              'absolute inset-0',
              rounded,
              'ring-4 pointer-events-none',
            )}
            style={
              {
                '--tw-ring-color': statusToken[status].color,
                color: statusToken[status].color,
                boxShadow: `inset 0 0 0 4px ${statusToken[status].color}`,
              } as React.CSSProperties
            }
          >
            <span
              className={cn(
                'absolute bottom-0 right-0 flex items-center justify-center',
                'rounded-full bg-[var(--color-rrt-cream-50)]',
                'border-2',
              )}
              style={{
                width: Math.max(20, Math.round(size * 0.32)),
                height: Math.max(20, Math.round(size * 0.32)),
                borderColor: statusToken[status].color,
                color: statusToken[status].color,
              }}
            >
              <StatusGlyph status={status} size={Math.max(20, Math.round(size * 0.32))} />
            </span>
          </span>
        ) : null}

        {/* Flag overlay (staff-only; dropped on kiosk surface) */}
        {renderedFlag ? (
          <span
            role="img"
            aria-label={`${displayFirstName} has a ${renderedFlag} flag`}
            className={cn(
              'absolute -top-1 -right-1',
              'flex items-center justify-center',
              'rounded-full bg-[var(--color-rrt-status-flag)] text-[var(--color-rrt-cream-50)]',
            )}
            style={{
              width: Math.max(16, Math.round(size * 0.22)),
              height: Math.max(16, Math.round(size * 0.22)),
            }}
          >
            <AlertTriangle aria-hidden="true" className="size-3" />
          </span>
        ) : null}
      </Tag>
    );
  },
);
Avatar.displayName = 'Avatar';
