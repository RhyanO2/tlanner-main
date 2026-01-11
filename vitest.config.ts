import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: {
      DOTENV_CONFIG_PATH: 'test.env',
      NODE_ENV: 'test',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/server.ts', 'src/app.ts', 'src/database/**'],
    },
    onConsoleLog(log: string, type: 'stdout' | 'stderr'): false | void {
      console.log('log in test: ', log);
      if (log === 'message from third party library' && type === 'stdout') {
        return false;
      }
    },
  },
});
