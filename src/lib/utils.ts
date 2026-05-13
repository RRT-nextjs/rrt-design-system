import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Safely concatenate Tailwind class strings. Uses tailwind-merge to dedupe
 * conflicting utilities (e.g. `px-2 px-4` collapses to `px-4`).
 *
 * @example
 *   cn('px-2 py-1', condition && 'bg-red-500', { 'opacity-50': disabled })
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ----------------------------------------------------------------------------
// Initials helpers (Avatar / Tile primitive)
// Reference: docs/spec/01-design-system.md §7
// ----------------------------------------------------------------------------

/**
 * Derive display initials from a person's name per the §7.1 algorithm:
 *   - 1 token  -> first letter, uppercased
 *   - 2+ tokens -> first letter of first + first letter of last, uppercased
 *   - Diacritics normalized (NFKD)
 *   - Non-letter tokens skipped (so "Mary-Anne" -> "MA", "Sienna F." -> "SF")
 *   - Emoji-only / empty -> "?"
 *
 * @example
 *   initialsFor('Mia')             // 'M'
 *   initialsFor('Mia Aaronson')    // 'MA'
 *   initialsFor('Mary Anne Smith') // 'MS'
 *   initialsFor('José García')     // 'JG'
 *   initialsFor('Sienna F.')       // 'SF'
 *   initialsFor('🎀')              // '?'
 */
export function initialsFor(name: string): string {
  if (!name) return '?';
  // Normalize unicode, strip combining diacritical marks (U+0300..U+036F)
  const normalized = name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '');
  // Split on whitespace and hyphens; keep only tokens that start with a letter
  const tokens = normalized
    .split(/[\s\-]+/)
    .filter((t) => /^[A-Za-z]/.test(t));
  if (tokens.length === 0) return '?';
  if (tokens.length === 1) {
    return tokens[0]!.charAt(0).toUpperCase();
  }
  const first = tokens[0]!.charAt(0);
  const last = tokens[tokens.length - 1]!.charAt(0);
  return (first + last).toUpperCase();
}

/**
 * The set of program-tone keys that map to bg/text color pairs. All six
 * combinations are pre-audited at AAA contrast per spec §1.1.f.
 */
export const TONE_KEYS = [
  'preschool',
  'beginners',
  'competitive',
  'flexibility',
  'ballet',
  'fallback',
] as const;

export type ProgramToneKey = (typeof TONE_KEYS)[number];

/**
 * The CSS variable names for the (bg, text) tone pair. Values resolve at
 * runtime from tokens.css.
 */
const TONE_VARS: Record<ProgramToneKey, { bg: string; text: string }> = {
  preschool: {
    bg: 'var(--color-rrt-program-preschool-bg)',
    text: 'var(--color-rrt-program-preschool-text)',
  },
  beginners: {
    bg: 'var(--color-rrt-program-beginners-bg)',
    text: 'var(--color-rrt-program-beginners-text)',
  },
  competitive: {
    bg: 'var(--color-rrt-program-competitive-bg)',
    text: 'var(--color-rrt-program-competitive-text)',
  },
  flexibility: {
    bg: 'var(--color-rrt-program-flexibility-bg)',
    text: 'var(--color-rrt-program-flexibility-text)',
  },
  ballet: {
    bg: 'var(--color-rrt-program-ballet-bg)',
    text: 'var(--color-rrt-program-ballet-text)',
  },
  fallback: {
    bg: 'var(--color-rrt-program-fallback-bg)',
    text: 'var(--color-rrt-program-fallback-text)',
  },
};

/**
 * Deterministic hash of a name -> one of six pre-audited tone pairs.
 * Same name ALWAYS produces the same (bg, text) pair. If `programId` is
 * provided and known, the program tone is used directly so all kids in a
 * program share a color.
 *
 * Every output pair is pre-audited at AAA contrast - there is no input that
 * produces a failing pair.
 *
 * @example
 *   initialsColorHash('Mia Aaronson')              // deterministic; one of the 6 tones
 *   initialsColorHash('Mia Aaronson')              // same result on repeat call
 *   initialsColorHash('Mia', 'preschool')          // preschool tone, ignoring hash
 *   initialsColorHash('Lily', 'preschool')         // also preschool (sibling consistency)
 *   initialsColorHash('Emma', 'unknown-program')   // falls through to hash
 *
 * @returns inline-style values: { backgroundColor, color }
 */
export function initialsColorHash(
  name: string,
  programId?: string | null,
): { backgroundColor: string; color: string } {
  // If programId matches a known tone, use it directly (cross-sibling visual
  // consistency).
  if (programId && TONE_KEYS.includes(programId as ProgramToneKey)) {
    const pair = TONE_VARS[programId as ProgramToneKey];
    return { backgroundColor: pair.bg, color: pair.text };
  }
  // Hash the name: sum of unicode codepoints mod number of tone keys.
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash += name.charCodeAt(i);
  }
  const key = TONE_KEYS[hash % TONE_KEYS.length]!;
  const pair = TONE_VARS[key];
  return { backgroundColor: pair.bg, color: pair.text };
}

/**
 * Derive the alt-text-safe first name from a full name. Privacy rule (§7.5):
 * alt text and hover tooltips MUST surface ONLY the first name, never the
 * full name. The student's last name is rendered as caption text in the Tile
 * primitive, NOT as image alt text.
 *
 * @example
 *   firstNameOf('Mia Aaronson')      // 'Mia'
 *   firstNameOf('Sienna F.')         // 'Sienna'
 *   firstNameOf('  Anna  Smith  ')   // 'Anna'
 *   firstNameOf('🎀')                // '🎀'  (single token, returned as-is)
 *   firstNameOf('')                  // ''
 */
export function firstNameOf(name: string): string {
  if (!name) return '';
  const trimmed = name.trim();
  const idx = trimmed.search(/\s/);
  return idx === -1 ? trimmed : trimmed.slice(0, idx);
}
