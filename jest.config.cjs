const process = require('process');

const esModules = ['@younho9/object', 'lodash-es'];

process.env.TZ = 'UTC';

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest/presets/js-with-ts-esm',
	testEnvironment: 'node',
	globalSetup: '<rootDir>/tests/setup-env.cjs',
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	transform: {
		// Use babel-jest to transpile tests with the next/babel preset
		// https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
		'^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {presets: ['next/babel']}],
	},
	transformIgnorePatterns: [`node_modules/(?!(${esModules.join('|')}))`],
	testPathIgnorePatterns: ['<rootDir>/cypress/'],
};
