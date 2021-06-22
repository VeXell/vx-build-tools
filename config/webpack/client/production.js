const { merge } = require('webpack-merge');
const TerserJSPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const baseConfig = require('./base');
const commonPaths = require('../paths');
const { CHUNKS_RULE_NAME } = require('../config');

const isAnalyze = typeof process.env.BUNDLE_ANALYZE !== 'undefined';

const plugins = [];

if (isAnalyze) {
    plugins.push(new BundleAnalyzerPlugin());
}

const cacheGroups = {
    styles: {
        name: 'styles',
        test: /\.(css|scss|sass)$/,
        chunks: 'all',
        enforce: true,
    },
    defaultVendors: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
    },
};

const bundleName = `${CHUNKS_RULE_NAME}.js`;

module.exports = (appConfig) => {
    return merge(baseConfig(appConfig), {
        devtool: false,
        mode: 'production',
        output: {
            path: commonPaths.buildDir,
            publicPath: '/',
            filename: bundleName,
            chunkFilename: bundleName,
            crossOriginLoading: 'use-credentials',
        },
        optimization: {
            minimizer: [new TerserJSPlugin()],
            splitChunks: {
                cacheGroups,
                chunks: 'all',
            },
            runtimeChunk: {
                name: 'runtime',
            },
        },
        module: {},
        plugins,
        stats: 'minimal',
    });
};
