const { join } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const commonPaths = require('./paths');
const dartSass = require('sass');
const { IS_DEVELOPMENT, FILES_RULE_NAME } = require('./config');
const { plugins, presets } = require(`../babel/${process.env.CONFIG_TYPE}.config`);

function getCssLoaders(
    isServer = false,
    { isSass = true, isModule = true },
    { IS_ISOMORPHIC_CSS }
) {
    const rules = [];

    if (IS_ISOMORPHIC_CSS) {
        // With isomorphic we keep CSS rules with JS bundles
        rules.push('isomorphic-style-loader-forked');
    } else {
        // Separate CSS to files
        if (!isServer) {
            // Do not use loader with SSR
            rules.push({
                loader: MiniCssExtractPlugin.loader,
            });
        }
    }

    // Translates CSS into CommonJS
    rules.push({
        loader: 'css-loader',
        options: {
            importLoaders: isSass ? 2 : 1, // With scss with should use 2 loaders before
            esModule: false, // Fix issue https://github.com/kriasoft/isomorphic-style-loader/issues/187
            modules: isModule && {
                localIdentName: IS_DEVELOPMENT
                    ? '[path][name]__[local]--[hash:base64:5]'
                    : '[hash:base64]',
                exportOnlyLocals: !IS_ISOMORPHIC_CSS && isServer,
            },
        },
    });

    // Loader for webpack to process CSS with PostCSS
    rules.push({ loader: 'postcss-loader', options: { sourceMap: IS_DEVELOPMENT } });

    if (isSass) {
        // Compiles Sass to CSS, using Node Sass by default
        rules.push({
            loader: 'sass-loader',
            options: { sourceMap: IS_DEVELOPMENT, implementation: dartSass },
        });
    }

    return rules;
}

function getConfig(type = 'client', appConfig = {}) {
    const IS_SERVER = Boolean(type === 'server');
    const IS_CLIENT = Boolean(type === 'client');

    // Basic rules
    let rules = [
        {
            test: /\.(js|jsx)$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    presets,
                    plugins,
                    cacheCompression: false,
                    cacheDirectory: false,
                },
            },
        },
        {
            test: /\.(ts|tsx)$/,
            exclude: /(node_modules)/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        presets,
                        plugins,
                    },
                },
                {
                    loader: 'ts-loader',
                    options: {
                        configFile: join(commonPaths.root, 'tsconfig.json'),
                        // HACK: const enum is not inlined, if transpileOnly is enabled
                        // transpileOnly is true for dev environment to speed up compilation
                        // transpileOnly: IS_DEVELOPMENT,
                        compilerOptions: {
                            allowJs: false,
                            noEmit: false,
                        },
                    },
                },
            ],
        },
    ];

    // Additional rules
    if (IS_CLIENT || IS_SERVER) {
        rules = [
            ...rules,
            ...[
                {
                    oneOf: [
                        {
                            test: /\.scss$/,
                            use: getCssLoaders(IS_SERVER, {}, appConfig),
                        },
                        {
                            test: /\.global\.scss$/,
                            use: getCssLoaders(IS_SERVER, { isModule: false }, appConfig),
                        },
                        {
                            test: /\.css$/,
                            use: getCssLoaders(
                                IS_SERVER,
                                { isSass: false, isModule: false },
                                appConfig
                            ),
                        },
                    ],
                },
                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {},
                        },
                        {
                            loader: 'react-svg-loader',
                            options: {
                                svgo: {
                                    plugins: [
                                        { removeTitle: false },
                                        { cleanupIDs: false },
                                        { cleanupAttrs: false },
                                        { collapseGroups: false },
                                        { mergePaths: false },
                                        { minifyStyles: false },
                                        { moveElemsAttrsToGroup: false },
                                        { moveGroupAttrsToElems: false },
                                        { removeDimensions: false },
                                        { convertShapeToPath: false },
                                        { collapseGroups: false },
                                        { inlineStyles: false },
                                        { removeStyleElement: false },
                                        { removeHiddenElems: false },
                                        { convertPathData: false },
                                        { convertStyleToAttrs: false },
                                        { convertTransform: false },
                                        { removeViewBox: false },
                                    ],
                                    floatPrecision: 2,
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.(?:ico|gif|png|jpg|jpeg|webp|mp3)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: `${FILES_RULE_NAME}.[ext]`,
                                context: join(commonPaths.root, 'src'),
                                outputPath: commonPaths.imagesFolder,
                                emitFile: !IS_SERVER,
                            },
                        },
                    ],
                },
                {
                    test: /\.(woff2|ttf|woff|eot)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: `${FILES_RULE_NAME}.[ext]`,
                                context: join(commonPaths.root, 'src'),
                                outputPath: commonPaths.fontsFolder,
                                emitFile: !IS_SERVER,
                            },
                        },
                    ],
                },
            ],
        ];
    }

    return rules;
}

module.exports = getConfig;
