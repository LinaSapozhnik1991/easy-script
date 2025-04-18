import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { FlatCompat } from '@eslint/eslintrc'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports'
import eslintPluginBoundaries from 'eslint-plugin-boundaries'
import eslintPluginPrettier from 'eslint-plugin-prettier'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript')
]

eslintConfig.push({
  plugins: {
    import: eslintPluginImport,
    'unused-imports': eslintPluginUnusedImports,
    boundaries: eslintPluginBoundaries,
    prettier: eslintPluginPrettier
  },
  rules: {
    'no-console': 'error',
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        'newlines-between': 'always'
      }
    ],
    'import/no-unresolved': 'error',
    'import/named': 'warn',
    'import/default': 'error',
    'import/namespace': 'error',
    'boundaries/element-types': 'warn',
    'prettier/prettier': 'error'
  },
  settings: {
    'boundaries/elements': [
      {
        type: 'component',
        name: '^[A-Z].*'
      }
    ],
    'import/resolver': {
      alias: {
        map: [
          ['@', './src/'],
          ['@utils', './src/utils']
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      },
      typescript: {}
    }
  }
})

export default eslintConfig
