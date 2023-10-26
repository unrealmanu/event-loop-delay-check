/* eslint-disable @typescript-eslint/no-var-requires */

const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
    rootDir: './',
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '.*\\.(spec|test)\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s', '!**/index.ts'],
    coverageDirectory: './coverage',
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/src/index.ts',
        '/dist/',
        '/coverage',
        '.eslintrc.js',
        'jest.config.js',
    ],
    globals: {
        'ts-jest': {
            isolatedModules: true,
        },
    },
    moduleFileExtensions: ['ts'],
    reporters: ['default'],
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
};
