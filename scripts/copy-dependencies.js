const copyNodeModules = require('copy-node-modules');
const path = require('path');

const args = process.argv.slice(2);
const projectDir = args[0];
const onlyProjectDir = args[1];

if (!projectDir) {
    console.error('Please provide project directory');
    process.exit(1);
}

console.log(`Copy dependencies for server. Project direcory ${projectDir}`);

// Copy dependencies
const srcDir = [];

if (onlyProjectDir === 'only-project') {
    srcDir.push(path.resolve(projectDir, `./`));
} else {
    srcDir.push(path.resolve(projectDir, `../`));
    srcDir.push(path.resolve(projectDir, `./`));
}

const dstDir = './build/server/';

const dirs = [...srcDir];

const copyDir = () => {
    const folder = dirs.shift();

    if (!folder) {
        // eslint-disable-next-line no-console
        console.error('\nCopy node dependencies for server done');
        return;
    }

    copyNodeModules(folder, dstDir, { devDependencies: false }, (err, results) => {
        // eslint-disable-next-line no-console
        console.log(`\nProcess folder ${folder}`);

        if (err) {
            // eslint-disable-next-line no-console
            console.error(err);
            return;
        }

        results.forEach(entry => {
            // eslint-disable-next-line no-console
            console.log(`Copy package name: ${entry.name}, version: ${entry.version}`);
        });

        copyDir();
    });
};

copyDir();
