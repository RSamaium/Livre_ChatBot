const builder = require('botbuilder')
const config = require('../config')

const connector = new builder.ChatConnector({
    appId: config.platforms.botframework.id,
    appPassword: config.platforms.botframework.token
})

module.exports = connector