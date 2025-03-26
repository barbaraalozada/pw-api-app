import { defineConfig } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
  retries: 1,
  workers: 1,
  reporter: 'html',
  globalTimeout: 20000,
  globalSetup: require.resolve('./global-setup.ts'),
  globalTeardown: require.resolve('./global-teardown.ts'),
  
  use: {
    trace: 'on',
    extraHTTPHeaders: {
      'Authorization': `Token ${process.env.ACCESS_TOKEN}`,
    },
  },

  projects: [
    {
      name: 'setup',
      testMatch: 'auth.setup.ts',
    },
    {
      name: 'articleSetup',
      testMatch: 'newArticle.setup.ts',
      dependencies: ['setup'],
      teardown: 'articleCleanUp',
    },
    {
      name: 'articleCleanUp',
      testMatch: 'articleCleanUp.setup.ts',
    },
    {
      name: 'likeCounter',
      testMatch: 'likesCounter.spec.ts',
      use: {
        browserName: 'chromium',
        storageState: '.auth/user.json',
      },
      dependencies: ['articleSetup'],
    },
    {
      name: 'regression',
      testIgnore: 'likesCounter.spec.ts',
      use: {
        browserName: 'chromium',
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'likeCounterGlobal',
      testMatch: 'likesCounterGlobal.spec.ts',
      use: {
        browserName: 'chromium',
        storageState: '.auth/user.json',
      },
    },
  ],
});
