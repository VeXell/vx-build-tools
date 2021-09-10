const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./base');
const commonPaths = require('../paths');
const { getProxyConfig } = require('../helpers');
const Dotenv = require('dotenv-webpack');

module.exports = (appConfig) => {
    const devServerHost = 'localhost';

    let proxy;

    if (process.env.PROXY_REMOTE_HOST && process.env.PROXY_LOCAL_PATHS) {
        if (!proxy) {
            proxy = [];
        }

        const urls = process.env.PROXY_LOCAL_PATHS.split(',');
        const config = getProxyConfig(process.env.PROXY_REMOTE_HOST, devServerHost);
        config.context = urls;

        proxy.push(config);

        console.log(
            `Proxy enabled to host ${process.env.PROXY_REMOTE_HOST} with URLs ${config.context.join(
                ','
            )}`
        );
    }

    if (process.env.PROXY_HOSTS) {
        console.log(`Proxy hosts ${process.env.PROXY_HOSTS}`);

        if (!proxy) {
            proxy = [];
        }

        const urls = process.env.PROXY_HOSTS.split(',');
        urls.forEach((host) => {
            const target = `https://${host}`;
            const realUrl = `/${host}`;

            const config = getProxyConfig(target, devServerHost, {
                pathRewrite(path) {
                    return path.replace(realUrl, '');
                },
            });

            config.context = realUrl;
            proxy.push(config);

            console.log(` Proxy URL ${realUrl} to host ${target}`);
        });
    }

    return merge(baseConfig(appConfig), {
        devtool: 'inline-source-map',
        devServer: {
            contentBase: commonPaths.devClientPath,
            historyApiFallback: true,
            overlay: true,
            open: true,
            stats: 'errors-only',
            compress: true,
            port: 9001,
            host: devServerHost,
            proxy,
        },
        module: {},
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new Dotenv({
                path: `${commonPaths.root}/.env`,
            }),
        ],
    });
};
