#!/usr/bin/env node

const path = require('path');
const myArgs = process.argv.slice(2);

const PROJECT_DIR = process.cwd();
const INIT_DIR = path.resolve(__dirname, `./config/init`);
const { promises: Fs, constants } = require('fs');

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
        description: 'Build project',
    },
    help: {
        key: 'help',
        description: 'Print help inpormation',
    },
};

switch (myArgs[0]) {
    case COMMANDS.init.key:
        tryCopyInitFiles();
        break;
    case COMMANDS.help.key:
        printHelp();
        break;
    default:
        console.log('Unknown command.');
        printHelp();
}

async function tryCopyInitFiles() {
    const webpackConfigFile = `${PROJECT_DIR}/webpack.config.js`;
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
