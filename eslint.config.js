const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        URLSearchParams: 'readonly'
      },
      ecmaVersion: 'latest',
      sourceType: 'commonjs'
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off'
    }
  }
];