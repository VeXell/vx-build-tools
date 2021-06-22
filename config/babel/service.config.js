module.exports = {
    presets: [['@babel/preset-env', { loose: true }], '@babel/preset-typescript'],
    plugins: [
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        [
            '@babel/plugin-proposal-object-rest-spread',
            {
                useBuiltIns: true,
            },
        ],
        '@babel/plugin-transform-arrow-functions',
        '@babel/plugin-transform-classes',
        '@babel/plugin-transform-destructuring',
        '@babel/plugin-transform-template-literals',
        '@babel/plugin-transform-object-super',
        '@babel/plugin-transform-shorthand-properties',
        '@babel/plugin-transform-computed-properties',
        '@babel/plugin-transform-parameters',
        '@babel/plugin-transform-block-scoping',
        '@babel/plugin-transform-spread',
        '@babel/plugin-transform-for-of',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-runtime',
    ],
};
