import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Badge, type BadgeVariant } from "./badge";

// Regression: the size variants declared font-size through the ambiguous
// text-shorthand arbitrary value instead of the property-arbitrary form.
// Tailwind v4 resolves that shorthand as a COLOR utility (an invalid
// declaration, since the token is a length), and tailwind-merge classifies
// it into the same group as the variant's REAL text-color class, so cn()
// dropped the variant color (it comes first; last conflicting class wins).
// Live badges inherited the parent font size and lost their intended text
// color. Same defect and fix as buttonVariants' sizes. Found by adversarial
// design review against the compiled dist consumed by rrt-studio.

afterEach(cleanup);

const VARIANT_TEXT_COLOR: Record<BadgeVariant, string> = {
  neutral: "text-[var(--color-rrt-text-soft)]",
  success: "text-[var(--color-rrt-success)]",
  warning: "text-[var(--color-rrt-warning)]",
  error: "text-[var(--color-rrt-error)]",
  info: "text-[var(--color-rrt-info)]",
  maroon: "text-[var(--color-rrt-maroon-700)]",
};

describe("Badge size font-size form", () => {
  it("sm carries the property-arbitrary caption font-size, never the ambiguous shorthand", () => {
    render(
      <Badge size="sm" data-testid="badge">
        Trial
      </Badge>,
    );
    const el = screen.getByTestId("badge");
    expect(el.className).toContain("[font-size:var(--text-caption)]");
    expect(el.className).not.toContain("text-[var(--text-caption)]");
  });

  it("md carries the property-arbitrary body-sm font-size, never the ambiguous shorthand", () => {
    render(
      <Badge size="md" data-testid="badge">
        Active
      </Badge>,
    );
    const el = screen.getByTestId("badge");
    expect(el.className).toContain("[font-size:var(--text-body-sm)]");
    expect(el.className).not.toContain("text-[var(--text-body-sm)]");
  });

  it("every variant keeps its text-color class through the cn() merge at both sizes", () => {
    for (const [variant, colorClass] of Object.entries(VARIANT_TEXT_COLOR) as Array<
      [BadgeVariant, string]
    >) {
      for (const size of ["sm", "md"] as const) {
        const testId = `badge-${variant}-${size}`;
        render(
          <Badge variant={variant} size={size} data-testid={testId}>
            x
          </Badge>,
        );
        expect(screen.getByTestId(testId).className, `${variant}/${size}`).toContain(colorClass);
      }
    }
  });

  it("a consumer text-color override coexists with the size font-size class", () => {
    render(
      <Badge size="sm" className="text-[var(--color-rrt-error)]" data-testid="badge">
        x
      </Badge>,
    );
    const el = screen.getByTestId("badge");
    // The font-size class must survive alongside the override; pre-fix the
    // ambiguous size class was itself merged away by the override, leaving
    // the badge with no size styling at all.
    expect(el.className).toContain("[font-size:var(--text-caption)]");
    expect(el.className).toContain("text-[var(--color-rrt-error)]");
    // The override replaces the variant color (a genuine color conflict).
    expect(el.className).not.toContain("text-[var(--color-rrt-text-soft)]");
  });
});
