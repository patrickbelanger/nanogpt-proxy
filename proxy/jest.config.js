export default {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["json-summary", "text", "lcov"],
  testEnvironment: 'node',
  transform: {},
  setupFiles: ['dotenv/config'],
};
