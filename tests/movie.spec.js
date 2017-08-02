const builder = require('botbuilder')
const assert = require('assert')
const sinon = require('sinon')

const config = require('../src/config')
const setup = require('../src/setup/bot')
const GenreService = require('../src/services/genre.service')
const MovieService = require('../src/services/movie.service')

describe('Conversation /movie', function () {

    let connector, bot

    beforeEach(() => {
        connector = new builder.ConsoleConnector()
        bot = setup(connector)
    })

    it('Chercher', (done) => {
        let step = 0

        sinon
            .stub(GenreService, 'fetch')
            .returns(Promise.resolve([
                {
                    id: 28,
                    name: 'Action'
                }
            ]))

        sinon
            .stub(MovieService, 'discover')
            .returns(Promise.resolve([
                {
                    "overview": "test_overview",
                    "title": "test_title",
                    "poster_path": "test.jpg"
                }
            ]))

        bot.on('send', (message) => {
            const { attachments, attachmentLayout, text } = message
            step++
            switch (step) {
                case 1:
                    assert.equal(text, 'Quel est votre genre de film ? (1. Action)')
                    connector.processMessage('1')
                    break
                case 2:
                    assert.equal(attachmentLayout, 'carousel')
                    assert.equal(attachments.length, 1)

                    const [attachment] = attachments
                    assert.equal(attachment.contentType, 'application/vnd.microsoft.card.hero')

                    const { title, text: contentText, images, buttons } = attachment.content
                    assert.equal(title, 'test_title')
                    assert.equal(contentText, 'test_overview')
                    assert.equal(images[0].url, `${config.themoviedb.imageRoot}/test.jpg`)
                    done()
            }

        })

        connector.processMessage('cherche')
    })

})