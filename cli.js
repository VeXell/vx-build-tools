#!/usr/bin/env node

const path = require('path');
const webpack = require('webpack');
const copyNodeDirs = require('./scripts/copy-dependencies');
const myArgs = process.argv.slice(2);

const PROJECT_DIR = process.cwd();
const INIT_DIR = path.resolve(__dirname, `./config/init`);
const { promises: Fs, constants } = require('fs');
const webpackConfigFile = `${PROJECT_DIR}/webpack.config.js`;

async function exists(path) {
    try {
        await Fs.access(path);
        return true;
    } catch {
        return false;
    }
}

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
    help: {
        key: 'help',
        description: 'Print help information',
    },
};

switch (myArgs[0]) {
    case COMMANDS.init.key:
        tryCopyInitFiles();
        break;
    case COMMANDS.help.key:
        printHelp();
        break;
    case COMMANDS.build.key:
        startBuild();
        break;
    default:
        console.log('Unknown command.');
        printHelp();
}

async function tryCopyInitFiles() {
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
            console.log('%c tsconfig.json already exists', 'color: #bada55');
        }

        try {
            await Fs.copyFile(
                `${INIT_DIR}/init.prettierrc.js`,
                `${PROJECT_DIR}/.prettierrc.js`,
                constants.COPYFILE_EXCL
            );
        } catch {
            console.log('%c .prettierrc.js already exists', 'color: #bada55');
        }

        try {
            await Fs.copyFile(
                `${INIT_DIR}/init.eslintrc.js`,
                `${PROJECT_DIR}/.eslintrc.js`,
                constants.COPYFILE_EXCL
            );
        } catch {
            console.log('%c .eslintrc.js already exists', 'color: #bada55');
        }
    } else {
        console.log(
            `Sorry, but project already inited. Please remove ${webpackConfigFile} to procced`
        );
    }
}

function printHelp() {
    const commandsList = Object.keys(COMMANDS).map((key) => {
        return ` - ${COMMANDS[key].key}: ${COMMANDS[key].description}`;
    });

    console.log(`
Please use these commands:
${commandsList.join(`\n`)}
`);
}

async function startBuild() {
    const mode = myArgs[1];

    if (!mode) {
        console.error('Please specify build mode');
        process.exit(1);
    }

    const isWebpackConfigExist = await exists(webpackConfigFile);

    if (!isWebpackConfigExist) {
        console.error('Webpack config file does not exists');
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
                `Build time: ${msToTime(stats.compilation.endTime - stats.compilation.startTime)}`
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

function msToTime(duration) {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return `${minutes} minutes ${seconds} seconds`;
}
