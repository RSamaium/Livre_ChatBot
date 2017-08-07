const builder = require('botbuilder')
const conversations = require('../conversations')
const middlewares = require('../middlewares')
const config = require('../config')
const ApiRecognizer = require('../core/api.recognizer')
const WitRecognizer = require('../core/wit.recognizer')

module.exports = (connector) => {
    const bot = new builder.UniversalBot(connector)

   // bot.recognizer(new ApiRecognizer(config.apiai.token))
    bot.recognizer(new WitRecognizer(config.witai.token))

    const assign = (object) => {
        for (let key in object) {
            object[key](bot, connector)
        }
    }

    assign(conversations)
    assign(middlewares)

    return bot
}



