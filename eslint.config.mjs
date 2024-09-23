// eslint.config.mjs
import { ESLint } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: ['node_modules', 'dist'], // Ignore these folders
  },
  {
    files: ['src/**/*.{ts,tsx}'], // Target TypeScript files
    languageOptions: {
      parser: tsParser, // TypeScript parser
      parserOptions: {
        ecmaVersion: 2020, // ECMAScript 2020 support
        sourceType: 'module', // ECMAScript modules
        project: './tsconfig.json', // TypeScript project config
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin, // TypeScript plugin
      prettier: prettierPlugin, // Prettier plugin
    },
    rules: {
      // TypeScript-specific rules (plugin:@typescript-eslint/recommended)
      ...tsPlugin.configs.recommended.rules,

      // Prettier integration (plugin:prettier/recommended)
      ...prettierConfig.rules,

      // Custom rules
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn',
      'no-debugger': 'warn',

      // Adjust this rule to allow short-circuit evaluations (&&, ||)
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true },
      ],

      // Configure @typescript-eslint/ban-ts-comment to allow @ts-ignore but warn
      '@typescript-eslint/ban-ts-comment': [
        'warn',
        {
          'ts-ignore': true, // Allow @ts-ignore with a warning
          'ts-nocheck': true, // Allow @ts-nocheck with a warning
          'ts-check': false, // Disallow @ts-check
          'ts-expect-error': true, // Allow @ts-expect-error
        },
      ],
    },
  },
];
