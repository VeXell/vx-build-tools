# VxBuildTools

Boilerplate code package to simplify build new projects on typescript. All important configs in one repo. Create fast new SPA or nodejs projects.

## How to use it

First you should add this repo into you project. At this moment it supports onlu git+ssh npm install:

```bash
npm i git+ssh://git@github.com/VeXell/vx-build-tools.git --save-dev
```

Then you can init new project. This command create `eslint`, `typescript`, `prettier` and `webpack` config files.

```bash
npx vx-build-tools init
```

Also you should add new few commands in your `package.json` file. For example:

**Example**

```json
...
"scripts": {
    "dev": "vx-build-tools watch service", // Use watch to server or service.
    // Or
    "dev": "vx-build-tools serve spa", // Use serve to start WebpackDevServer
    "build": "npm run cleanBuild && npm run build:server",
    "build:server": "vx-build-tools build service --copy-node-modules",
    "cleanBuild": "rm -rf ./build/*",
    "lint": "npm run lint:ts && npm run lint:es",
    "lint:ts": "tsc --noEmit",
    "lint:es": "eslint --cache --ext .js,.ts ./src"
},
...
```

## Available configs

`vx-build-tools` supports 3 different types of apps:

-   `client` - if you want to build NodeJS application with react
-   `server` - if you want to build NodeJS SSR application
-   `service` - if you want to build NodeJS service or any other service without render
-   `spa` - if you want to build SPA application with react

Every type of the apps has own configured webpack config. For more information you can run help command `npx vx-build-tools help`

Your development working files should be located in `./src` directory. Entry point is `index.ts`

## Commands

-   `vx-build-tools build [config-type] [...options]` - This command build your project with spicific config type. For `server` and `service` config please use option `--copy-node-modules` it copy your `node_modules` dependencies in build folder (`devDependencies` would be skipped)
-   `vx-build-tools watch [config-type]` - This command run development mode and watch files in `./dev` directory. It uses `nodemon` to restart app after changes.

**Remark:** Do not forget to add `./build` and `./dev` folders to `.gitignore`
