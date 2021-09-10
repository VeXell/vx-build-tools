const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { DefinePlugin } = require('webpack');

const commonPaths = require('./paths.js');
const resolve = require('./resolve.js');
const rulesConfig = require('./rules');

const { IS_DEVELOPMENT, IS_PRODUCTION } = require('./config');

const outputPath = IS_PRODUCTION ? commonPaths.buildServer : commonPaths.devServerPath;
const bundleName = `[name].js`;

module.exports = (appConfig) => {
    const rules = rulesConfig(process.env.CONFIG_TYPE, appConfig);

    return {
        mode: 'production',
        entry: ['./src/server/index'],
        target: 'node',
        node: {
            __dirname: false,
            __filename: false,
        },
        externals: [nodeExternals({ modulesDir: `${commonPaths.root}/node_modules` })],
        resolve,
        output: {
            path: outputPath,
            filename: 'app.js',
            chunkFilename: bundleName,
        },
        optimization: {
            moduleIds: 'deterministic',
            splitChunks: {
                // include all types of chunks
                chunks: 'all',
            },
        },
        plugins: [
            new DefinePlugin({
                __DEV__: IS_DEVELOPMENT,
            }),
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 1,
            }),
        ],
        module: {
            rules,
        },
        stats: 'minimal',
    };
};
