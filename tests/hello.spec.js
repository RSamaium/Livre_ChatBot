const builder = require('botbuilder')
const assert = require('assert')
const setup = require('../src/setup/bot')

describe('Conversation /hello', function () {

    let connector, bot

    beforeEach(() => {
        connector = new builder.ConsoleConnector()
        bot = setup(connector)
    })

    it('Tester la réponse : Salut ou Bonjour', (done) => {

        bot.on('send', (message) => {
            const { text } = message
            assert.notEqual(['Salut', 'Bonjour'].indexOf(text), -1)
            done()
        })

        connector.processMessage('hello')
    })

})