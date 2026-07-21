import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { colors, programTones } from '../lib/tokens';

/**
 * Enforces the WCAG contrast annotations in tokens.css.
 *
 * Every color declaration may carry claims in a fixed grammar inside its
 * trailing comment:
 *
 *   `<N.NN>:1 vs --rrt-<name>`            hex fg vs another token
 *   `<N.NN>:1 text-on-bg`                 program tone: -bg line vs its -text sibling
 *   `composites to <N.NN>:1 vs --rrt-<name>`   rgba fg composited over the counterpart
 *
 * Each claim is recomputed with the WCAG 2.1 relative-luminance formula and
 * must match at two decimals. Level phrases in the same sentence
 * (`passes AAA` = 7.0, `passes AA Normal` = 4.5, `passes AA Large` = 3.0,
 * `passes 1.4.11` = 3.0) must be cleared by every claim in that sentence.
 * Prose that mentions a ratio without the `vs --rrt-` grammar (for example
 * `2.71:1 against surface-sunken` or historical `measured 1.66:1` notes) is
 * deliberately not machine-checked.
 *
 * This test exists because the 2026-07-21 adversarial review found annotated
 * ratios that did not survive sRGB recomputation (line claimed 3.02:1 but
 * measured 1.66:1; warning claimed 4.92:1 but measured 3.84:1).
 */

const TOKENS_CSS = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'tokens.css'),
  'utf8',
);

type Rgb = readonly [number, number, number];

function hexToRgb(hex: string): Rgb {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function channel(c8: number): number {
  const c = c8 / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance([r, g, b]: Rgb): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: Rgb, b: Rgb): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Gamma-space alpha compositing, matching how browsers flatten CSS colors. */
function composite(fg: Rgb, alpha: number, bg: Rgb): Rgb {
  return [
    Math.round(alpha * fg[0] + (1 - alpha) * bg[0]),
    Math.round(alpha * fg[1] + (1 - alpha) * bg[1]),
    Math.round(alpha * fg[2] + (1 - alpha) * bg[2]),
  ];
}

interface Declaration {
  name: string;
  hex: string | null;
  rgba: { rgb: Rgb; alpha: number } | null;
  comment: string;
  line: number;
}

const DECL_RE =
  /^\s*(--color-rrt-[a-z0-9-]+):\s*(#[0-9A-Fa-f]{6}|rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*(0?\.\d+)\s*\))\s*;\s*(?:\/\*(.*)\*\/)?\s*$/;

function parseDeclarations(css: string): Declaration[] {
  const out: Declaration[] = [];
  css.split('\n').forEach((raw, idx) => {
    const m = raw.match(DECL_RE);
    if (!m) return;
    const value = m[2];
    out.push({
      name: m[1],
      hex: value.startsWith('#') ? value : null,
      rgba: value.startsWith('rgba')
        ? {
            rgb: [Number(m[3]), Number(m[4]), Number(m[5])] as const,
            alpha: Number(m[6]),
          }
        : null,
      comment: (m[7] ?? '').trim(),
      line: idx + 1,
    });
  });
  return out;
}

const declarations = parseDeclarations(TOKENS_CSS);

/** First occurrence wins: the light @theme block defines the canonical hex
 * for names the dark block later overrides. */
const tokenMap = new Map<string, string>();
for (const d of declarations) {
  if (d.hex && !tokenMap.has(d.name)) tokenMap.set(d.name, d.hex);
}

function resolve(shortName: string): string {
  const hex = tokenMap.get(`--color-rrt-${shortName}`);
  if (!hex) throw new Error(`claim references unknown token --rrt-${shortName}`);
  return hex;
}

const VS_CLAIM_RE = /(?<!composites to )(\d+\.\d{2}):1 vs --rrt-([a-z0-9-]+)/g;
const COMPOSITE_CLAIM_RE = /composites to (\d+\.\d{2}):1 vs --rrt-([a-z0-9-]+)/g;
const TONE_CLAIM_RE = /(\d+\.\d{2}):1 text-on-bg/g;

const LEVELS: ReadonlyArray<readonly [RegExp, number, string]> = [
  [/passes AAA/, 7.0, 'AAA'],
  [/passes AA Normal/, 4.5, 'AA Normal'],
  [/passes AA Large/, 3.0, 'AA Large'],
  [/passes 1\.4\.11/, 3.0, '1.4.11'],
];

interface Claim {
  claimed: number;
  actual: number;
  label: string;
}

function claimsInSentence(d: Declaration, sentence: string): Claim[] {
  const claims: Claim[] = [];
  for (const m of sentence.matchAll(COMPOSITE_CLAIM_RE)) {
    if (!d.rgba) throw new Error(`${d.name}: composite claim on a non-rgba declaration`);
    const bg = hexToRgb(resolve(m[2]));
    claims.push({
      claimed: Number(m[1]),
      actual: contrast(composite(d.rgba.rgb, d.rgba.alpha, bg), bg),
      label: `${d.name} composited vs --rrt-${m[2]}`,
    });
  }
  for (const m of sentence.matchAll(VS_CLAIM_RE)) {
    if (!d.hex) throw new Error(`${d.name}: hex claim on a non-hex declaration`);
    claims.push({
      claimed: Number(m[1]),
      actual: contrast(hexToRgb(d.hex), hexToRgb(resolve(m[2]))),
      label: `${d.name} vs --rrt-${m[2]}`,
    });
  }
  for (const m of sentence.matchAll(TONE_CLAIM_RE)) {
    const textName = d.name.replace(/-bg$/, '-text');
    if (!d.hex || textName === d.name) {
      throw new Error(`${d.name}: text-on-bg claim outside a program tone -bg line`);
    }
    claims.push({
      claimed: Number(m[1]),
      actual: contrast(hexToRgb(resolve(textName.replace('--color-rrt-', ''))), hexToRgb(d.hex)),
      label: `${textName} on ${d.name}`,
    });
  }
  return claims;
}

describe('tokens.css contrast annotations', () => {
  it('parses the expected token surface', () => {
    // Light theme plus dark overrides; a structural rewrite that drops
    // declarations below this floor should be a conscious decision.
    expect(declarations.length).toBeGreaterThanOrEqual(50);
    expect(tokenMap.get('--color-rrt-bg')).toBe('#F7F3EE');
  });

  const annotated = declarations.filter((d) =>
    /(\d+\.\d{2}):1 (vs --rrt-|text-on-bg)/.test(d.comment),
  );

  it('has at least the historically annotated coverage', () => {
    expect(annotated.length).toBeGreaterThanOrEqual(38);
  });

  for (const d of annotated) {
    describe(`${d.name} (line ${d.line})`, () => {
      const sentences = d.comment.split(/\.\s+/);
      for (const sentence of sentences) {
        const claims = claimsInSentence(d, sentence);
        if (claims.length === 0) continue;

        for (const claim of claims) {
          it(`${claim.label}: annotated ${claim.claimed.toFixed(2)}:1 matches recomputation`, () => {
            expect(claim.actual.toFixed(2)).toBe(claim.claimed.toFixed(2));
          });
        }

        for (const [re, threshold, levelName] of LEVELS) {
          if (!re.test(sentence)) continue;
          for (const claim of claims) {
            it(`${claim.label}: clears the claimed ${levelName} threshold (${threshold}:1)`, () => {
              expect(claim.actual).toBeGreaterThanOrEqual(threshold);
            });
          }
          break; // strictest matching level phrase governs the sentence
        }
      }
    });
  }

  it('keeps the TS token mirror in lockstep with tokens.css', () => {
    const expectedFromTs: Record<string, string> = {
      '--color-rrt-bg': colors.bg,
      '--color-rrt-surface': colors.surface,
      '--color-rrt-surface-hover': colors.surfaceHover,
      '--color-rrt-surface-sunken': colors.surfaceSunken,
      '--color-rrt-line': colors.line,
      '--color-rrt-line-strong': colors.lineStrong,
      '--color-rrt-text': colors.text,
      '--color-rrt-text-soft': colors.textSoft,
      '--color-rrt-text-faint': colors.textFaint,
      '--color-rrt-maroon-900': colors.maroon900,
      '--color-rrt-maroon-800': colors.maroon800,
      '--color-rrt-maroon-700': colors.maroon700,
      '--color-rrt-maroon-500': colors.maroon500,
      '--color-rrt-maroon-300': colors.maroon300,
      '--color-rrt-maroon-50': colors.maroon50,
      '--color-rrt-gold-500': colors.gold500,
      '--color-rrt-gold-700': colors.gold700,
      '--color-rrt-cream-50': colors.cream50,
      '--color-rrt-cream-100': colors.cream100,
      '--color-rrt-cream-300': colors.cream300,
      '--color-rrt-success': colors.success,
      '--color-rrt-success-bg': colors.successBg,
      '--color-rrt-warning': colors.warning,
      '--color-rrt-warning-bg': colors.warningBg,
      '--color-rrt-error': colors.error,
      '--color-rrt-error-bg': colors.errorBg,
      '--color-rrt-info': colors.info,
      '--color-rrt-info-bg': colors.infoBg,
    };
    for (const [name, hex] of Object.entries(expectedFromTs)) {
      expect(tokenMap.get(name), name).toBe(hex.toUpperCase());
    }
    for (const [tone, def] of Object.entries(programTones)) {
      expect(tokenMap.get(`--color-rrt-program-${tone}-bg`), tone).toBe(def.bg);
      expect(tokenMap.get(`--color-rrt-program-${tone}-text`), tone).toBe(def.text);
    }
  });

  it('status colors track their semantic sources', () => {
    expect(tokenMap.get('--color-rrt-status-checkedin')).toBe(colors.success);
    expect(tokenMap.get('--color-rrt-status-late')).toBe(colors.warning);
    expect(tokenMap.get('--color-rrt-status-absent')).toBe(colors.textFaint);
    expect(tokenMap.get('--color-rrt-status-pending')).toBe(colors.textSoft);
    expect(tokenMap.get('--color-rrt-status-flag')).toBe(colors.error);
  });
});
