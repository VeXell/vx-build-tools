const path = require('path');
const root = process.env.CURRENT_DIR;

const buildDir = path.resolve(root, './build');
const src = path.resolve(root, './src');
const devDir = path.resolve(root, './dev');

module.exports = {
    root,
    buildDir,
    buildClient: path.resolve(buildDir, './client'),
    buildServer: path.resolve(buildDir, './server'),
    src,
    envPath: path.resolve(src, './env'),
    entryPath: path.resolve(src, './index'),
    clientEntryPath: path.resolve(src, './client/index'),
    serverEntryPath: path.resolve(src, './server/index'),
    devDir,
    devClientPath: path.resolve(devDir, './client'),
    devServerPath: path.resolve(devDir, './server'),

    templatePath: path.resolve(root, './public/index.html'),
    publicFilesPath: path.resolve(root, './public'),

    imagesFolder: 'images/',
    fontsFolder: 'fonts/',
    cssFolder: 'css/',
    jsFolder: 'js/',
};
