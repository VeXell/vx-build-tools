// Add env configuration for webpack
require('dotenv').config();

// Set correct current dir to resolve files
const currentDir = process.cwd();
process.env.CURRENT_DIR = currentDir;

const { mode, requireFile, appConfig } = require('vx-build-tools/config/webpack/bootstrap');

const webpack = () => {
    console.log(`👉 Running project in "${mode}" mode using ${requireFile} 🛠️`);
    const config = require(requireFile)(appConfig);

    config.context = currentDir;
    return config;
};

module.exports = webpack;
