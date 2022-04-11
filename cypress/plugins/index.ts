import process from 'process';

import {loadEnvConfig} from '@next/env'; // eslint-disable-line import/no-extraneous-dependencies

const config: Cypress.PluginConfig = (on, config) => {
	const {combinedEnv} = loadEnvConfig(process.cwd());

	config.env = combinedEnv;

	return config;
};

export default config;
