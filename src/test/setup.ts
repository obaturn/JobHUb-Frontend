import '@testing-library/jest-dom';

// Property-based test configuration
export const PBT_CONFIG = {
  numRuns: 100, // Minimum 100 iterations per property
  timeout: 5000,
  seed: 42,
  path: "test-results",
  verbose: true
};