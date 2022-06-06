const process = require('process');

const {loadEnvConfig} = require('@next/env');

const setupEnv = async () => {
	process.env.TZ = 'UTC';

	loadEnvConfig(process.env.PWD);
};

module.exports = setupEnv;
