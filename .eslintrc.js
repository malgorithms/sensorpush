module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    files: ['**/*.ts', '*.d.ts'],
    exclude: ['lib/', '**/*.js'],
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/explicit-member-accessibility': 2,
    '@typescript-eslint/no-explicit-any': 0,
    'no-var': 2,
    'prefer-const': 2,
    'no-duplicate-imports': 0,
    'comma-dangle': [2, 'always-multiline'],
    strict: [2, 'global'],
  },
  settings: {},
  overrides: [
    {
      files: ['src/**/*.ts', '__tests__/*.ts'],
      env: {
        jest: true,
      },
    },
  ],
}
