const process = require('process');

const {loadEnvConfig} = require('@next/env');

const setupEnv = async () => {
	loadEnvConfig(process.env.PWD);
};

module.exports = setupEnv;
