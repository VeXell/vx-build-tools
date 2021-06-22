const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const FILES_RULE_NAME = '[name].[hash:20]';
const CHUNKS_RULE_NAME = '[name].[chunkhash:20]';
const CONTENT_RULE_NAME = '[name].[contenthash:20]';

module.exports = {
    IS_DEVELOPMENT,
    FILES_RULE_NAME,
    CHUNKS_RULE_NAME,
    CONTENT_RULE_NAME,
    IS_PRODUCTION,
};
