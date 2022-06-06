const getNamingConventionRule = ({isTsx}) => ({
	'@typescript-eslint/naming-convention': [
		'error',
		{
			/// selector: ['variableLike', 'memberLike', 'property', 'method'],
			// Note: Leaving out `parameter` and `typeProperty` because of the mentioned known issues.
			// Note: We are intentionally leaving out `enumMember` as it's usually pascal-case or upper-snake-case.
			selector: [
				'variable',
				'function',
				'classProperty',
				'objectLiteralProperty',
				'parameterProperty',
				'classMethod',
				'objectLiteralMethod',
				'typeMethod',
				'accessor',
			],
			format: ['strictCamelCase', isTsx && 'StrictPascalCase'].filter(Boolean),
			// We allow double underscore because of GraphQL type names and some React names.
			leadingUnderscore: 'allowSingleOrDouble',
			trailingUnderscore: 'allow',
			// Ignore `{'Retry-After': retryAfter}` type properties.
			// filter: {
			// 	regex: '[- ]',
			// 	match: false,
			// },
		},
		{
			selector: 'typeLike',
			format: ['StrictPascalCase'],
		},
		{
			selector: 'variable',
			types: ['boolean'],
			format: ['StrictPascalCase'],
			prefix: ['is', 'has', 'can', 'should', 'will', 'did'],
		},
		// Allow UPPER_CASE in global constants.
		{
			selector: 'variable',
			modifiers: ['const', 'global'],
			format: [
				'strictCamelCase',
				isTsx && 'StrictPascalCase',
				'UPPER_CASE',
			].filter(Boolean),
		},
		{
			selector: 'variable',
			types: ['boolean'],
			modifiers: ['const', 'global'],
			format: ['UPPER_CASE'],
			prefix: ['IS_', 'HAS_', 'CAN_', 'SHOULD_', 'WILL_', 'DID_'],
			filter: '[A-Z]{2,}',
		},
		{
			// Interface name should not be prefixed with `I`.
			selector: 'interface',
			filter: /^(?!I)[A-Z]/.source,
			format: ['StrictPascalCase'],
		},
		{
			// Type parameter name should either be `T` or a descriptive name.
			selector: 'typeParameter',
			filter: /^T$|^[A-Z][a-zA-Z]+$/.source,
			format: ['StrictPascalCase'],
		},
		// Allow these in non-camel-case when quoted.
		{
			selector: ['classProperty', 'objectLiteralProperty'],
			format: null,
			modifiers: ['requiresQuotes'],
		},
	],
});

/** @type {import('xo').Options & {overrides?: Array<{files: string} & import('xo').Options>}} */
module.exports = {
	prettier: true,
	extends: [
		'xo-react',
		/** @see https://github.com/yannickcr/eslint-plugin-react#configuration */
		'plugin:react/jsx-runtime',
		'plugin:cypress/recommended',
		'plugin:@next/next/core-web-vitals',
	],
	ignores: ['next-env.d.ts', 'yarn.lock'],
	rules: {
		'import/extensions': 'off',
		'import/order': [
			'warn',
			{
				'newlines-between': 'always',
				'alphabetize': {
					order: 'asc',
					caseInsensitive: true,
				},
			},
		],
		'react/function-component-definition': [
			2,
			{
				namedComponents: ['arrow-function'],
			},
		],
		/** @see https://github.com/sindresorhus/eslint-plugin-unicorn/issues/781 */
		'unicorn/no-array-callback-reference': 'off',
		/** @see https://github.com/webpack/webpack/issues/13290 */
		'unicorn/prefer-node-protocol': 'off',
	},
	overrides: [
		{
			files: '**/*.{ts,tsx}',
			rules: {
				...getNamingConventionRule({isTsx: false}),
				'@typescript-eslint/consistent-type-imports': [
					'error',
					{
						prefer: 'type-imports',
					},
				],
			},
		},
		{
			files: '**/*.tsx',
			rules: {
				...getNamingConventionRule({isTsx: true}),
				/** @see https://github.com/typescript-eslint/typescript-eslint/issues/1184 */
				'@typescript-eslint/no-floating-promises': [
					'error',
					{
						ignoreVoid: true,
					},
				],
				'react/prop-types': 'off',
				'unicorn/filename-case': [
					'error',
					{
						cases: {
							camelCase: true,
							pascalCase: true,
						},
					},
				],
			},
		},
	],
};
