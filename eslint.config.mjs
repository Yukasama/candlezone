import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import js from '@eslint/js';
import next from '@next/eslint-plugin-next';
import stylistic from '@stylistic/eslint-plugin';
import n from 'eslint-plugin-n';
import prettier from 'eslint-plugin-prettier/recommended';
import promise from 'eslint-plugin-promise';
import regexp from 'eslint-plugin-regexp';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = tseslint.config(
  js.configs.recommended,
  comments.recommended,
  prettier,
  promise.configs['flat/recommended'],
  regexp.configs['flat/recommended'],
  n.configs['flat/recommended-script'],
  security.configs.recommended,
  sonarjs.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@next/next': next,
      unicorn,
      stylistic,
    },
    rules: {
      '@typescript-eslint/no-misused-promises': 'off',
      curly: 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'unicorn/numeric-separators-style': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'n/no-missing-import': 'off',
      'n/no-extraneous-import': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
      'security/detect-object-injection': 'off',
      'sonarjs/cognitive-complexity': 'warn',
      'sonarjs/deprecation': 'warn',
      'sonarjs/no-nested-conditional': 'warn',
      'sonarjs/table-header': 'off',
      'stylistic/arrow-parens': ['error', 'always'],
      'stylistic/brace-style': ['error', '1tbs'],
      'stylistic/indent': 'off',
      'stylistic/indent-binary-ops': 'off',
      'stylistic/member-delimiter-style': 'off',
      'stylistic/multiline-ternary': 'off',
      'stylistic/no-tabs': 'off',
      'stylistic/operator-linebreak': 'off',
      'stylistic/quotes': 'off',
      'stylistic/semi': 'off',
      'stylistic/quote-props': ['error', 'as-needed'],
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    ignores: [
      '**/test-results',
      '**/playwright-report',
      '**/.vercel',
      '**/node_modules',
    ],
  },
);

export default eslintConfig;
