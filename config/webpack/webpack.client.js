const developmentConfig = require('./client/development.js');
const productionConfig = require('./client/production.js');
const { IS_DEVELOPMENT } = require('./config');

module.exports = appConfig =>
    IS_DEVELOPMENT ? developmentConfig(appConfig) : productionConfig(appConfig);
