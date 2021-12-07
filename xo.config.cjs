/** @type {import('xo').Options} */
module.exports = {
  prettier: true,
  extends: ['xo-react', 'plugin:@next/next/core-web-vitals'],
  ignores: ['next-env.d.ts'],
  rules: {
    /** {@link https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/index.js#L18-L19} */
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'import/extensions': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/no-array-callback-reference': 'off',
  },
  overrides: [
    {
      files: '**/*.tsx',
      rules: {
        /** {@link https://github.com/xojs/eslint-config-xo-typescript/blob/main/index.js#L280} */
        '@typescript-eslint/naming-convention': [
          'error',
          {
            // Selector: ['variableLike', 'memberLike', 'property', 'method'],
            // Note: Leaving out `parameter` and `typeProperty` because of the mentioned known issues.
            // Note: We are intentionally leaving out `enumMember` as it's usually pascal-case or upper-snake-case.
            selector: [
              'classProperty',
              'objectLiteralProperty',
              'parameterProperty',
              'classMethod',
              'objectLiteralMethod',
              'typeMethod',
              'accessor',
            ],
            format: ['strictCamelCase'],
            // We allow double underscope because of GraphQL type names and some React names.
            leadingUnderscore: 'allowSingleOrDouble',
            trailingUnderscore: 'allow',
            // Ignore `{'Retry-After': retryAfter}` type properties.
            filter: {
              regex: '[- ]',
              match: false,
            },
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
          {
            selector: ['variable', 'function'],
            format: ['strictCamelCase', 'StrictPascalCase'],
            // We allow double underscope because of GraphQL type names and some React names.
            leadingUnderscore: 'allowSingleOrDouble',
            trailingUnderscore: 'allow',
          },
        ],
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
