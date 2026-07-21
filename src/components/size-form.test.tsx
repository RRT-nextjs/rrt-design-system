import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Pill } from "./ui/pill";
import { ProgramChip } from "./ui/program-chip";
import { Input } from "./ui/input";

// Repository-wide regression for the ambiguous font-size utility form
// (adversarial review, 2026-07-21). Tailwind v4 resolves
// `text-[var(--text-*)]` as a COLOR utility - an invalid declaration, since
// the token is a length - and tailwind-merge groups it with any REAL
// text-color class on the same element, dropping one of them. Badge and
// Button were fixed first; the review then found the same form in 24 more
// production files. The source contract below pins the WHOLE tree to the
// property-arbitrary `[font-size:var(--text-*)]` form; the rendered cases
// are representative merge regressions for primitives that pair a size with
// a real text color (the exact drop scenario).

afterEach(cleanup);

function listSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return listSourceFiles(full);
    if (!/\.(ts|tsx)$/.test(name) || /\.test\./.test(name)) return [];
    return [full];
  });
}

describe("font-size utility form (source contract)", () => {
  it("no production source uses the ambiguous text-[var(--text-*)] shorthand", () => {
    const offenders = listSourceFiles(join(__dirname, ".."))
      .filter((file) => /text-\[var\(--text-/.test(readFileSync(file, "utf8")))
      .map((file) => file.split("/src/")[1] ?? file);
    expect(offenders).toEqual([]);
  });
});

describe("representative merge regressions (size + real text color survive cn)", () => {
  it("Pill keeps the property-arbitrary size and its variant text color", () => {
    render(
      <Pill data-testid="pill" size="sm">
        Filter
      </Pill>,
    );
    const el = screen.getByTestId("pill");
    expect(el.className).toContain("[font-size:var(--text-body-sm)]");
    expect(el.className).not.toContain("text-[var(--text-body-sm)]");
    expect(el.className).toMatch(/text-\[var\(--color-rrt-[a-z0-9-]+\)\]/);
  });

  it("ProgramChip keeps the property-arbitrary caption size at sm", () => {
    render(<ProgramChip data-testid="chip" programId="preschool" size="sm" />);
    const el = screen.getByTestId("chip");
    expect(el.className).toContain("[font-size:var(--text-caption)]");
    expect(el.className).not.toContain("text-[var(--text-caption)]");
  });

  it("Input keeps the property-arbitrary size and its real text color together", () => {
    // Default size is lg: the 16px body token (the iOS-zoom floor for inputs).
    render(<Input data-testid="input" aria-label="Name" />);
    const el = screen.getByTestId("input");
    expect(el.className).toContain("[font-size:var(--text-body)]");
    expect(el.className).not.toContain("text-[var(--text-body)]");
    expect(el.className).toContain("text-[var(--color-rrt-text)]");
  });
});
