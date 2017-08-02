const _ = require('lodash');
const development = require('./development');
const configDefault = require('./default');
const env = process.env.NODE_ENV;

const config = {
  configDefault,
  development
}

let configObj = config.configDefault;

if (config[env]) {
  configObj = _.merge(configObj, config[env]);
}

module.exports = configObj
