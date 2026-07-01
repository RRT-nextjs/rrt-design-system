import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

// Regression: the guarded onClick used to be declared BEFORE the `...props`
// spread, so a consumer onClick silently OVERWROTE the disabled/loading guard -
// a Button with `disabled` + `onClick` still fired on activation. Mouse clicks
// were masked by aria-disabled:pointer-events-none (CSS), but the button stays
// deliberately FOCUSABLE, so keyboard Enter/Space reached the un-guarded
// handler. Found by rrt-studio's conversation composer test.

afterEach(cleanup);

describe("Button click guard", () => {
  it("does NOT call onClick when disabled (click)", async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(
      <Button disabled onClick={spy}>
        Save
      </Button>,
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(spy).not.toHaveBeenCalled();
  });

  it("does NOT call onClick when disabled (keyboard Enter on the focusable button)", async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(
      <Button disabled onClick={spy}>
        Save
      </Button>,
    );
    screen.getByRole("button", { name: "Save" }).focus();
    await user.keyboard("{Enter}");
    expect(spy).not.toHaveBeenCalled();
  });

  it("does NOT call onClick while loading", async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(
      <Button loading onClick={spy}>
        Save
      </Button>,
    );
    await user.click(screen.getByRole("button"));
    expect(spy).not.toHaveBeenCalled();
  });

  it("calls onClick normally when active, and sets aria-disabled only when inactive", async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<Button onClick={spy}>Save</Button>);
    const btn = screen.getByRole("button", { name: "Save" });
    expect(btn.getAttribute("aria-disabled")).toBeNull();
    await user.click(btn);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("other pass-through props still spread (e.g. data attributes, aria-label)", () => {
    render(
      <Button disabled aria-label="Save the form" data-testid="x">
        Save
      </Button>,
    );
    const btn = screen.getByTestId("x");
    expect(btn.getAttribute("aria-label")).toBe("Save the form");
    expect(btn.getAttribute("aria-disabled")).toBe("true");
  });
});
