module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      impliedStrict: true,
    },
  },

  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended',
    'plugin:sonarjs/recommended',
    // "plugin:unicorn/recommended",
    'plugin:prettier/recommended',
    // 'plugin:@typescript-eslint/recommended-type-checked',
  ],

  plugins: [
    // '@typescript-eslint',
    'sonarjs',
    // "unicorn",
    'prettier',
    'prefer-arrow',
  ],

  rules: {
    curly: 'warn',
    'testing-library/no-debugging-utils': 'off',
    'unicorn/prevent-abbreviations': 'off',
    // '@typescript-eslint/no-misused-promises': [
    //   2,
    //   {
    //     checksVoidReturn: {
    //       attributes: false,
    //     },
    //   },
    // ],
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
