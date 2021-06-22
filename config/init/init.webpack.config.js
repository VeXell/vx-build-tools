// Add env configuration for webpack
require('dotenv').config();

// Set correct current dir to resolve files
const currentDir = process.cwd();
process.env.CURRENT_DIR = currentDir;

const { mode, requireFile } = require('vebuildtools/config/webpack/bootstrap');

const webpack = () => {
    // eslint-disable-next-line no-console
    console.log(`👉 Running special project in "${mode}" mode using ${requireFile} 🛠️`);
    const config = require(requireFile)();

    config.context = currentDir;
    return config;
};

module.exports = webpack;
