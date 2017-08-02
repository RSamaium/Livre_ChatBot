const builder = require('botbuilder')
const conversations = require('../conversations')
const middlewares = require('../middlewares')
const config = require('../config')

module.exports = (connector) => {
    const bot = new builder.UniversalBot(connector)

    const assign = (object) => {
        for (let key in object) {
            object[key](bot, connector)
        }
    }

    assign(conversations)
    assign(middlewares)

    return bot
}



