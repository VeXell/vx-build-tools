#!/usr/bin/env node

const path = require('path');
const webpack = require('webpack');
const copyNodeDirs = require('./scripts/copy-dependencies');
const myArgs = process.argv.slice(2);

const PROJECT_DIR = process.cwd();
const INIT_DIR = path.resolve(__dirname, `./config/init`);
const { promises: Fs, constants } = require('fs');
const webpackConfigFile = `${PROJECT_DIR}/webpack.config.js`;

const COMMANDS = {
    init: {
        key: 'init',
        description: 'Init new project and copy important files',
    },
    build: {
        key: 'build',
        description: `Build project with specific mode. Use "build [mode] [options]."
          Options: 
           --copy-node-modules: Copy build dependencies node_modules. Use only for projects run with nodejs
        `,
    },
    watch: {
        key: 'watch [mode]',
        description: 'Webpack watch src directory',
    },
    help: {
        key: 'help',
        description: 'Print help information',
    },
};

switch (myArgs[0]) {
    case COMMANDS.init.key:
        actionInitFiles();
        break;
    case COMMANDS.help.key:
        actionHelp();
        break;
    case COMMANDS.build.key:
        actionBuild();
        break;
    case COMMANDS.watch.key:
        actionWatch();
        break;
    default:
        console.log('Unknown command.');
        actionHelp();
}

// Action functions

async function actionInitFiles() {
    const isInited = await exists(webpackConfigFile);

    if (!isInited) {
        await Fs.copyFile(`${INIT_DIR}/init.webpack.config.js`, webpackConfigFile);

        try {
            await Fs.copyFile(
                `${INIT_DIR}/init.tsconfig.json`,
                `${PROJECT_DIR}/tsconfig.json`,
                constants.COPYFILE_EXCL
            );
        } catch {
            console.log('\x1b[36m%s\x1b[0m', 'tsconfig.json already exists');
        }

        try {
            await Fs.copyFile(
                `${INIT_DIR}/init.prettierrc.js`,
                `${PROJECT_DIR}/.prettierrc.js`,
                constants.COPYFILE_EXCL
            );
        } catch {
            console.log('\x1b[36m%s\x1b[0m', '.prettierrc.js already exists');
        }

        try {
            await Fs.copyFile(
                `${INIT_DIR}/init.eslintrc.js`,
                `${PROJECT_DIR}/.eslintrc.js`,
                constants.COPYFILE_EXCL
            );
        } catch {
            console.log('\x1b[36m%s\x1b[0m', '.eslintrc.js already exists');
        }
    } else {
        console.log(
            `Sorry, but project already inited. Please remove ${webpackConfigFile} to procced`
        );
    }
}

function actionHelp() {
    const commandsList = Object.keys(COMMANDS).map((key) => {
        return ` - ${COMMANDS[key].key}: ${COMMANDS[key].description}`;
    });

    console.log(`
Please use these commands:
${commandsList.join(`\n`)}
`);
}

async function actionBuild() {
    const mode = myArgs[1];

    if (!mode) {
        console.error('\x1b[41m%s\x1b[0m', 'Please specify working config mode');
        process.exit(1);
    }

    const isWebpackConfigExist = await exists(webpackConfigFile);

    if (!isWebpackConfigExist) {
        console.error('\x1b[41m%s\x1b[0m', 'Webpack config file does not exists');
        process.exit(1);
    }

    // Set environment variables
    process.env.NODE_ENV = 'production';
    process.env.CONFIG_TYPE = mode;

    const getWebpackConfig = require(webpackConfigFile);
    const webpackConfig = getWebpackConfig();

    const compiler = webpack(webpackConfig);

    const outputBuildDir = webpackConfig.output.path;
    // const outputFileName = webpackConfig.output.filename;

    console.log(`Start build project to dir "${outputBuildDir}" ...`);

    compiler.run((err, stats) => {
        if (err) {
            console.log(err);
        } else {
            console.log(
                stats.toString({
                    chunks: false,
                    colors: true,
                })
            );
        }

        compiler.close((closeErr) => {
            if (closeErr) {
                console.log(closeErr);
            }
        });
    });

    const hasCopyNodeModulesFlag = myArgs.find((entry) => entry === '--copy-node-modules');

    if (hasCopyNodeModulesFlag) {
        console.log(`Run copy node_modules to ${outputBuildDir}`);
        copyNodeDirs([PROJECT_DIR], outputBuildDir);
    }
}

async function actionWatch() {
    const mode = myArgs[1];

    if (!mode) {
        console.error('\x1b[41m%s\x1b[0m', 'Please specify working config mode');
        process.exit(1);
    }

    const isWebpackConfigExist = await exists(webpackConfigFile);

    if (!isWebpackConfigExist) {
        console.error('\x1b[41m%s\x1b[0m', 'Webpack config file does not exists');
        process.exit(1);
    }

    // Set environment variables
    process.env.NODE_ENV = 'development';
    process.env.CONFIG_TYPE = mode;

    const getWebpackConfig = require(webpackConfigFile);
    const webpackConfig = getWebpackConfig();

    const compiler = webpack(webpackConfig);

    console.log(`Start watching files ...`);

    compiler.watch(
        {
            aggregateTimeout: 300,
            poll: undefined,
            ignored: /node_modules/,
        },
        (err, stats) => {
            if (err) {
                console.log(err);
            }

            console.log(
                stats.toString({
                    chunks: false,
                    colors: true,
                })
            );
        }
    );
}

// Help functions

async function exists(path) {
    try {
        await Fs.access(path);
        return true;
    } catch {
        return false;
    }
}
