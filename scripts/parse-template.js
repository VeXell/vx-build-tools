const { parse } = require('node-html-parser');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const projectDir = args[0];

if (!projectDir) {
    console.error('Please provide project directory');
    process.exit(1);
}

console.log(`Parse index file template. Project direcory ${projectDir}`);

const webpackConfig = require(`${projectDir}/webpack.config`);
const appConfig = require(`${projectDir}/app.config`);

const commonPaths = webpackConfig.getPaths();

const IS_DEVELOPMENT_MODE = process.env.NODE_ENV === 'development';
const HTML_FILE_NAME = 'index.html';
const TEMPLATE_DATA_FILE_NAME = appConfig.TEMPLATE_DATA_FILE_NAME || 'template-data.json';

const indexFile = `${commonPaths.buildClient}/${HTML_FILE_NAME}`;
const clientBuildDir = commonPaths.buildClient;

const parsedData = {
    script: [],
    stylesheet: [],
    preload: [],
    meta: [],
    linkMeta: [],
};

const cacheDirs = {};

const IMAGE_REGEXP = '/(.*).[0-9a-f]{20}.[a-zA-Z0-9_-]+$/';

const parseImageLink = (imageLink) => {
    const fileData = path.parse(imageLink);
    const findDir = path.resolve(clientBuildDir, `.${fileData.dir}`);

    if (!cacheDirs[findDir]) {
        cacheDirs[findDir] = fs.readdirSync(findDir).map((file) => file);
    }

    const regExp = `${fileData.name}.[0-9a-f]{20}${fileData.ext}$`;

    const realFile = cacheDirs[findDir].find((file) => new RegExp(regExp).test(file));

    if (realFile) {
        return `${fileData.dir}/${realFile}`;
    } else {
        // eslint-disable-next-line no-console
        console.error(`Can not find hashed file for path ${imageLink} \n File is ignored`);
        return undefined;
    }
};

fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
        // eslint-disable-next-line no-console
        console.error('Something went wrong:', err);
        return;
    }

    const html = parse(data, { script: true, style: true });

    parsedData.script = html.querySelectorAll('script').map((script) => {
        return script.toString();
    });

    html.querySelectorAll('meta').forEach((meta) => {
        if (meta.attributes.property) {
            switch (meta.attributes.property) {
                case 'og:image':
                case 'twitter:image': {
                    // All this links without hash. We should add them here
                    const href = meta.attributes.content;

                    if (href && !new RegExp(IMAGE_REGEXP).test(href)) {
                        const imageLink = parseImageLink(href);

                        if (imageLink) {
                            meta.setAttribute('content', imageLink);
                        }
                    }
                    break;
                }
                default:
            }
        }

        parsedData.meta.push(meta.toString());
    });

    html.querySelectorAll('link').forEach((link) => {
        if (link.attributes.rel) {
            switch (link.attributes.rel) {
                case 'stylesheet':
                    parsedData.stylesheet.push(link.toString());
                    break;
                case 'preload':
                    parsedData.preload.push(link.toString());
                    break;
                case 'apple-touch-icon':
                case 'icon':
                case 'mask-icon':
                case 'manifest':
                case 'apple-touch-startup-image': {
                    // All this links without hash. We should add them here
                    const href = link.attributes.href;

                    if (href && !new RegExp(IMAGE_REGEXP).test(href)) {
                        const imageLink = parseImageLink(href);

                        if (imageLink) {
                            link.setAttribute('href', imageLink);
                            parsedData.linkMeta.push(link.toString());
                        }
                    } else {
                        parsedData.linkMeta.push(link.toString());
                    }

                    break;
                }
                default:
            }
        }
    });

    const filePath = IS_DEVELOPMENT_MODE
        ? `${commonPaths.devServerPath}/${TEMPLATE_DATA_FILE_NAME}`
        : `${commonPaths.buildServer}/${TEMPLATE_DATA_FILE_NAME}`;

    fs.writeFile(filePath, JSON.stringify(parsedData), () => {
        // eslint-disable-next-line no-console
        if (err) return console.error(err);
    });
});
