const baseConfig = require('@younho9/xo-configs/react');

/** @type {import('xo').Options & {overrides?: Array<{files: string} & import('xo').Options>}} */
module.exports = {
	...baseConfig,
	prettier: true,
	extends: [...baseConfig.extends, 'plugin:@next/next/core-web-vitals'],
	ignores: ['next-env.d.ts'],
	rules: {
		...baseConfig.rules,
		'react/prop-types': 'off',
	},
};
