import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import n from 'eslint-plugin-n';
import prettier from 'eslint-plugin-prettier/recommended';
import promise from 'eslint-plugin-promise';
import regexp from 'eslint-plugin-regexp';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import { dirname } from 'path';
import ts from 'typescript-eslint';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  n.configs['flat/recommended-script'],
  security.configs.recommended,
  sonarjs.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parser: '@typescript-eslint/parser',
      ecmaVersion: 'latest',
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    plugins: {
      unicorn,
      stylistic,
    },
    rules: {
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
      'sonarjs/function-return-type': 'warn',
      'sonarjs/no-misused-promises': 'off',
      'sonarjs/no-nested-conditional': 'warn',
      'sonarjs/table-header': 'off',
      'sonarjs/no-unstable-nested-components': 'warn',
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
  },
  js.configs.recommended,
  comments.recommended,
  prettier,
  promise.configs['flat/recommended'],
  regexp.configs['flat/recommended'],
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...ts.configs.recommended,
];

export default eslintConfig;
