const developmentConfig = require('./spa/development.js');
const productionConfig = require('./spa/production.js');
const { IS_DEVELOPMENT } = require('./config');

module.exports = (appConfig) =>
    IS_DEVELOPMENT ? developmentConfig(appConfig) : productionConfig(appConfig);
