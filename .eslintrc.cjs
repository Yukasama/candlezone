// const stylistic = require('@stylistic/eslint-plugin')
// const customizedStylistic = stylistic.configs.customize({
//   flat: false,
//   indent: 2,
//   jsx: false,
// })

module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  parserOptions: {
    project: true,
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      impliedStrict: true,
    },
  },

  plugins: [
    // '@typescript-eslint',
    'sonarjs',
    // "unicorn",
    'promise',
    // 'security',
    'security-node',
    'prettier',
    'prefer-arrow',
    'n',
    // '@stylistic',
    'regexp',
    'import',
  ],

  extends: [
    'next/core-web-vitals',
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended',
    // 'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    // 'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    // 'plugin:unicorn/recommended',
    'plugin:prettier/recommended',
    'plugin:sonarjs/recommended-legacy',
    'plugin:n/recommended',
    'plugin:promise/recommended',
    // 'plugin:security/recommended-legacy',
    'plugin:security-node/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@eslint-community/eslint-comments/recommended',
    'plugin:regexp/recommended',
  ],

  rules: {
    curly: 'warn',
    'testing-library/no-debugging-utils': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'n/no-missing-import': 'off',
    'n/no-unsupported-features/node-builtins': 'off',
    // '@typescript-eslint/no-misused-promises': [
    //   2,
    //   {
    //     checksVoidReturn: {
    //       attributes: false,
    //     },
    //   },
    // ],
    // ...customizedStylistic.rules,
    // '@stylistic/arrow-parens': ['error', 'always'],
    // '@stylistic/brace-style': ['error', '1tbs'],
    '@stylistic/indent': 'off',
    '@stylistic/indent-binary-ops': 'off',
    // '@stylistic/member-delimiter-style': [
    //   'error',
    //   {
    //     multiline: { delimiter: 'semi' },
    //   },
    // ],
    '@stylistic/operator-linebreak': 'off',
    // '@stylistic/quote-props': ['error', 'as-needed'],
    // '@stylistic/semi': ['error', 'always'],
  },

  ignorePatterns: [
    '.vscode/*',
    'build/*',
    'coverage/*',
    'dist/*',
    'node-ts/*',
    'scripts/*',
    'temp/*',
    'node_modules/*',
    '.eslintrc.cjs',
  ],
}
