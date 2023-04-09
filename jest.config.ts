import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['/node_modules/(?!(ky))'],
  collectCoverageFrom: [
    './**/*.{js,jsx,ts,tsx}',
    '!./**/*.test.{js,jsx,ts,tsx}',
    '!./**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 100,
      lines: 70,
      statements: -2,
    },
  },
};

export default config;
