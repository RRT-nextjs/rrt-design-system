import { defineConfig } from "vitest/config";

// Component tests run in jsdom. Kept minimal: this package had no test harness
// before the Button disabled-click-guard regression (found by a consumer's test
// in rrt-studio) made one necessary.
export default defineConfig({
  // tsconfig jsx is react-jsx (the tsup build sets its own jsx:'automatic'
  // regardless), which vite/vitest compile natively - no override needed.
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "jsdom",
  },
});
