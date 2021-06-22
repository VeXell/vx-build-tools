const path = require('path');
const webpackDir = path.resolve(__dirname, './');
// Get ENV variables
const mode = process.env.NODE_ENV || 'development';
const configType = process.env.CONFIG_TYPE;

const requireFile = `${webpackDir}/webpack.${configType}`;

if (!configType) {
    console.error('Please set webpack CONFIG_TYPE');
    process.exit(1);
} else {
    try {
        fs.existsSync(requireFile);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`CONFIG_TYPE "${configType}" does not exists`);
        process.exit(1);
    }
}

if (!process.env.CURRENT_DIR) {
    console.error('env.CURRENT_DIR is not defined in webpack config');
    process.exit(1);
}

module.exports = {
    mode,
    requireFile,
    configType,
    webpackDir,
};
