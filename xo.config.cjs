const baseConfig = require('@younho9/xo-configs/next');

/** @type {import('xo').Options & {overrides?: Array<{files: string} & import('xo').Options>}} */
module.exports = {
	...baseConfig,
	prettier: true,
};
