const copyNodeModules = require('copy-node-modules');
const path = require('path');

const args = process.argv.slice(2);
const projectDir = args[0];
const dstDir = args[1];

if (!projectDir) {
    console.error('Please provide project directory');
    process.exit(1);
}

if (!dstDir) {
    console.error('Please provide destination directory');
    process.exit(1);
}

console.log(`Copy dependencies for server. Project direcory ${projectDir}`);

// Copy dependencies
const srcDir = [path.resolve(projectDir, `./`)];
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

        results.forEach((entry) => {
            // eslint-disable-next-line no-console
            console.log(`Copy package name: ${entry.name}, version: ${entry.version}`);
        });

        copyDir();
    });
};

copyDir();
