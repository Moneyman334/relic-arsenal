import importPlugin from 'eslint-plugin-import';

export default [
  {
    ignores: ['coverage/**', 'node_modules/**', 'dist/**', '.git/**', '*.lock'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/extensions': ['error', 'ignorePackages', { js: 'always', ts: 'always' }],
    },
  },
];