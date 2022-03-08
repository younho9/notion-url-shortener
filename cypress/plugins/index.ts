import process from 'process';

import {loadEnvConfig} from '@next/env'; // eslint-disable-line import/no-extraneous-dependencies
import type Cypress from 'cypress';

const config: Cypress.PluginConfig = (on, config) => {
	const {combinedEnv} = loadEnvConfig(process.env.PWD!);

	config.env = combinedEnv;

	return config;
};

export default config;
