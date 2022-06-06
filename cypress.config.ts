import process from 'process';

import {loadEnvConfig} from '@next/env'; // eslint-disable-line import/no-extraneous-dependencies
import {defineConfig} from 'cypress';

export default defineConfig({
	e2e: {
		defaultCommandTimeout: 8000,
		baseUrl: 'http://localhost:3000',
		env: loadEnvConfig(process.cwd()).combinedEnv,
		video: false,
		screenshotOnRunFailure: false,
		experimentalSessionAndOrigin: true,
	},
});
