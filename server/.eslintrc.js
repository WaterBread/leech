module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'standard-with-typescript',
  ],
  rules: {
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/strict-boolean-expressions": 0,
    "comma-dangle": ["error", "never"],
    "semi": ["error", "always"],
    "@typescript-eslint/promise-function-async": 0,
    "max-len": ["error", {"code": 120, "ignoreUrls": true}]
  },
  "parserOptions": {
    "project": "./tsconfig.json"
  }
};