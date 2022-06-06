import process from 'process';

import {loadEnvConfig} from '@next/env'; // eslint-disable-line import/no-extraneous-dependencies

const setupEnv = async () => {
	process.env.TZ = 'UTC';

	loadEnvConfig(process.env.PWD!);
};

export default setupEnv;
