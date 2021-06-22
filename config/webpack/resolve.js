const commonPaths = require('./paths.js');

const resolveConfig = {
    modules: [`${commonPaths.root}/src`, `${commonPaths.root}/node_modules`],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'],
    alias: {
        public: commonPaths.publicFilesPath,
    },
};

module.exports = resolveConfig;
