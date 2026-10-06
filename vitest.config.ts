import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@healthx/types': path.resolve(__dirname, 'packages/types/src/index.ts'),
      '@healthx/shared': path.resolve(__dirname, 'packages/shared/src/index.ts'),
      '@healthx/fhir': path.resolve(__dirname, 'packages/fhir/src/index.ts'),
      '@healthx/security': path.resolve(__dirname, 'packages/security/src/index.ts'),
      '@healthx/ai': path.resolve(__dirname, 'packages/ai/src/index.ts'),
      '@healthx/database': path.resolve(__dirname, 'packages/database/src/index.ts'),
      '@healthx/ui': path.resolve(__dirname, 'packages/ui/src/index.tsx'),
    },
  },
});
