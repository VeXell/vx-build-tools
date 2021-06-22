const copyNodeModules = require('copy-node-modules');
const path = require('path');

const copyDir = (sourceDirs, destinationDir) => {
    const folder = sourceDirs.shift();

    if (!folder) {
        // eslint-disable-next-line no-console
        console.log('\x1b[32m%s\x1b[0m', 'Copy node dependencies for server done');
        console.log('');
        return;
    }

    copyNodeModules(folder, destinationDir, { devDependencies: false }, (err, results) => {
        // eslint-disable-next-line no-console
        console.log(`Process folder ${folder}`);

        if (err) {
            // eslint-disable-next-line no-console
            console.error(err);
            return;
        }

        results.forEach((entry) => {
            // eslint-disable-next-line no-console
            console.log(
                '\x1b[2m%s\x1b[0m',
                `Copy package name: ${entry.name}, version: ${entry.version}`
            );
        });

        copyDir(sourceDirs, destinationDir);
    });
};

if (require.main === module) {
    const args = process.argv.slice(2);
    const projectDir = args[0];
    const dstDir = args[1];

    if (!projectDir) {
        console.error('\x1b[41m%s\x1b[0m', 'Please provide project directory');
        process.exit(1);
    }

    if (!dstDir) {
        console.error('\x1b[41m%s\x1b[0m', 'Please provide destination directory');
        process.exit(1);
    }

    // Copy dependencies
    const srcDir = [path.resolve(projectDir, `./`)];
    const dirs = [...srcDir];

    console.log(
        '\x1b[36m%s\x1b[0m',
        `Copy dependencies for server. Project directory ${projectDir}`
    );

    copyDir(dirs, dstDir);
}

module.exports = copyDir;
