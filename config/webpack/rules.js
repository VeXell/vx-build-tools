const { join } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const commonPaths = require('./paths');
const dartSass = require('sass');
const { IS_DEVELOPMENT, FILES_RULE_NAME } = require('./config');

function getCssLoaders(
    isServer = false,
    { isSass = true, isModule = true },
    { IS_ISOMORPHIC_CSS }
) {
    const rules = [];

    if (IS_ISOMORPHIC_CSS) {
        // With isomorphic we keep CSS rules with JS bundles
        rules.push('isomorphic-style-loader');
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
    rules.push({
        loader: 'postcss-loader',
        options: {
            sourceMap: IS_DEVELOPMENT,
            postcssOptions: {
                plugins: ['postcss-preset-env', 'cssnano', 'postcss-normalize'],
            },
        },
    });

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
            test: /\.(ts|tsx)$/,
            exclude: /(node_modules)/,
            use: [
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
                            test: /\.global\.scss$/,
                            use: getCssLoaders(IS_SERVER, { isModule: false }, appConfig),
                        },
                        {
                            test: /\.scss$/,
                            use: getCssLoaders(IS_SERVER, {}, appConfig),
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
                    use: !appConfig.SVG_AS_FILE
                        ? ['@svgr/webpack']
                        : [
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
                    test: /\.(?:ico|gif|png|jpg|jpeg|webp|mp3|webm|mp4|mov)$/i,
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

    if (IS_SERVER) {
        rules.push({
            test: /\.tpl$/,
            type: 'asset/source',
        });
    }

    return rules;
}

module.exports = getConfig;
