const getSecondLevelDomain = (host) => {
    return host.replace('http://', '').replace('https://', '').split('.').splice(-2).join('.');
};

const getProxyConfig = (target, devServerHost, options = {}) => {
    // In this case we set cookie on second level domain
    const cookieDomain = `.${getSecondLevelDomain(target)}`;
    console.log(` Cookie domain ${cookieDomain}`);

    const config = {
        target,
        secure: false,
        changeOrigin: true,
        cookieDomainRewrite: {
            '*': devServerHost,
        },
        onProxyRes: (proxyRes) => {
            Object.keys(proxyRes.headers).forEach((key) => {
                if (key === 'set-cookie') {
                    proxyRes.headers['set-cookie'] = proxyRes.headers[key].map((cookie) =>
                        cookie.replace('Secure;', '').replace('secure;', '')
                    );
                }
            });
        },
    };

    if (options.pathRewrite) {
        config.pathRewrite = options.pathRewrite;
    }

    return config;
};

module.exports = {
    getProxyConfig,
    getSecondLevelDomain,
};
