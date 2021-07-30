# VxBuildTools

Boilerplate code package to simplify build new projects on typescript. All important configs in one repo. Create fast new SPA or nodejs projects.

## How to use it

First you should add this repo into you project. At this moment it supports onlu git+ssh npm install:

```bash
npm i git+ssh://git@github.com/VeXell/build-tools.git --save-dev
```

Then you can init new project. This command create `eslint`, `typescript`, `prettier` and `webpack` config files.

```bash
npx vxbuildtools init
```

Also you should add new few commands in your `package.json` file. For example:

**Example**

```json
...
"scripts": {
    "dev": "vxbuildtools watch service",
    "build": "npm run cleanBuild && npm run build:server",
    "build:server": "vxbuildtools build service --copy-node-modules",
    "cleanBuild": "rm -rf ./build/*",
    "lint": "npm run lint:ts && npm run lint:es",
    "lint:ts": "tsc --noEmit",
    "lint:es": "eslint --cache --ext .js,.ts ./src"
},
...
```

## Available configs

`vxbuildtools` supports 3 different types of apps:

-   `client` - if you want to build SPA application on react
-   `server` - if you want to build SSR server to render react application
-   `service` - if you want to build nodejs service or any other service without rendering anything

Every type of the apps has own configured webpack config. For more information you can run help command `npx vxbuildtools help`

Your development working files should be located in `./src` directory. Entry point is `index.ts`

## Commands

-   `vxbuildtools build [config-type] [...options]` - This command build your project with spicific config type. For `server` and `service` config please use option `--copy-node-modules` it copy your `node_modules` dependencies in build folder (`devDependencies` would be skipped)
-   `vxbuildtools watch [config-type]` - This command run development mode and watch files in `./dev` directory. It uses `nodemon` to restart app after changes.

**Remark:** Do not forget to add `./build` and `./dev` folders to `.gitignore`
