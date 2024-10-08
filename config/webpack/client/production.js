const { merge } = require('webpack-merge');
const TerserJSPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');

const baseConfig = require('./base');
const commonPaths = require('../paths');
const { CHUNKS_RULE_NAME } = require('../config');

const isAnalyze = typeof process.env.BUNDLE_ANALYZE !== 'undefined';

const plugins = [
    new PreloadWebpackPlugin({
        rel: 'preload',
        include: 'initial',
        fileBlacklist: [/\.map/, /\.png/, /\.jpg/, /\.svg/, /\.woff/, /\.woff2/, /\.webp/, /\.webm/, /\.mp4/],
        as(entry) {
            if (/\.css$/.test(entry)) return 'style';
            return 'script';
        },
    }),
];

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
            path: commonPaths.buildClient,
            publicPath: '/',
            filename: bundleName,
            chunkFilename: bundleName,
            crossOriginLoading: 'anonymous',
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
