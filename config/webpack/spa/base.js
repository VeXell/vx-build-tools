const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { DefinePlugin } = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');

const commonPaths = require('../paths');
const resolve = require('../resolve.js');
const rulesConfig = require('../rules');
const { IS_DEVELOPMENT } = require('../config');

module.exports = (appConfig) => {
    const rules = rulesConfig('client', appConfig);

    const plugins = [
        // Removes/cleans build folders and unused assets when rebuilding.
        new CleanWebpackPlugin(),
        // Generates an HTML file from a template.
        new HtmlWebpackPlugin({
            inject: true,
            template: commonPaths.templatePath,
            filename: 'index.html',
            minify: {
                removeComments: false, // We use comments to replace variables
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        new DefinePlugin({
            __DEV__: IS_DEVELOPMENT,
        }),
        new MiniCssExtractPlugin({
            filename: IS_DEVELOPMENT ? '[name].css' : '[name].[fullhash].css',
        }),
        new WebpackAssetsManifest({}),
    ];

    return {
        entry: {
            app: [commonPaths.entryPath],
        },
        output: {
            publicPath: '/',
        },
        module: {
            rules,
        },
        resolve,
        plugins,
    };
};
