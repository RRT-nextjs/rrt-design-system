import { defineConfig } from 'tsup';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: 'es2022',
  external: ['react', 'react-dom', 'tailwindcss'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
  /**
   * After bundling, prepend a "use client" directive to the bundled JS files
   * so Next.js (React Server Components) treats every export from this
   * package as a client-side primitive. The bundler strips top-level
   * directives during tree-shaking; we re-inject them here at the file head.
   */
  async onSuccess() {
    const distDir = path.resolve('dist');
    const files = ['index.js', 'index.cjs'];
    for (const file of files) {
      const full = path.join(distDir, file);
      if (!fs.existsSync(full)) continue;
      const original = fs.readFileSync(full, 'utf8');
      if (original.startsWith('"use client"') || original.startsWith("'use client'")) {
        continue;
      }
      fs.writeFileSync(full, '"use client";\n' + original);
    }
  },
});
