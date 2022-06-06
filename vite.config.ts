import path from 'path';
import {fileURLToPath} from 'url';

import {defineConfig} from 'vitest/config';

export default defineConfig({
	alias: {
		'@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
	},
	test: {
		globalSetup: ['./tests/setup-env'],
	},
});
