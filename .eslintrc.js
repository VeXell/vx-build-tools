module.exports = {
    root: true,
    extends: [require.resolve('vx-eslint/base.eslintrc')],
    env: {
        browser: false,
        es2021: true,
        node: true,
    },
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [],
    rules: {
        indent: 'off',
        semi: ['error', 'always'],
        'comma-dangle': 'off',
        quotes: ['error', 'single', { allowTemplateLiterals: true }],
        'space-before-function-paren': ['warn', 'never'],
    },
    overrides: [],
};
