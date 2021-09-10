const getSecondLevelDomain = (host) => {
    return host.replace('http://', '').replace('https://', '').split('.').splice(-2).join('.');
};

const getProxyConfig = (target, devServerHost, options = {}) => {
    const config = {
        target,
        secure: false,
        changeOrigin: true,
        cookieDomainRewrite: devServerHost,
        onProxyReq: (proxyReq) => {
            if (proxyReq.getHeader('origin')) {
                proxyReq.setHeader('origin', target);
            }
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
