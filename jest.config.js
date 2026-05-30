/**
 * Jest configuration for the EarningsFlow monorepo.
 *
 * We rely on ts-jest to compile TypeScript on the fly for our tests.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages', '<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  clearMocks: true
};