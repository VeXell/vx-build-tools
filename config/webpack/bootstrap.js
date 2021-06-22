const path = require('path');
const fs = require('fs');

if (!process.env.CURRENT_DIR) {
    console.error('env.CURRENT_DIR is not defined in webpack config');
    process.exit(1);
}

if (!process.env.CONFIG_TYPE) {
    console.error('Please set webpack env.CONFIG_TYPE');
    process.exit(1);
}

const webpackDir = path.resolve(__dirname, './');
const babelDir = path.resolve(__dirname, '../babel');
const mode = process.env.NODE_ENV || 'development';
const configType = process.env.CONFIG_TYPE;
const requireFile = `${webpackDir}/webpack.${configType}.js`;

try {
    fs.existsSync(requireFile);
} catch (err) {
    // eslint-disable-next-line no-console
    console.error(`CONFIG_TYPE "${configType}" does not exists. Request file ${requireFile}`);
    process.exit(1);
}

try {
    fs.existsSync(`${babelDir}/${configType}.config.js`);
} catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Please create Babel config for "${configType}". It does not exists.`);
    process.exit(1);
}

module.exports = {
    mode,
    requireFile,
    configType,
    webpackDir,
};
