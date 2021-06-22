#!/usr/bin/env node

const path = require('path');
const myArgs = process.argv.slice(2);

const PROJECT_DIR = process.cwd();
const INIT_DIR = path.resolve(__dirname, `./config/init`);
const { promises: Fs } = require('fs');

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
        await Fs.copyFile(`${INIT_DIR}/init.tsconfig.json`, `${PROJECT_DIR}/tsconfig.json`);
        await Fs.copyFile(`${INIT_DIR}/init.prettierrc.js`, `${PROJECT_DIR}/.prettierrc.js`);
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
