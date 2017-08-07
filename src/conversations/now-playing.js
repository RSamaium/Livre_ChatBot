const builder = require('botbuilder')
const config = require('../config')
const MovieService = require('../services/movie.service')

module.exports = (bot) => {
    bot.dialog('nowPlaying', [
        async (session, args) => {
            session.sendTyping()
            let nowPlaying = await MovieService.nowPlaying()
            nowPlaying = nowPlaying.map(data => {
                return new builder.HeroCard(session)
                    .title(data.title)
                    .text(data.overview)
                    .subtitle(`${data.vote_average} / 10`)
                    .images([builder.CardImage.create(session, `${config.themoviedb.imageUrl}/${data.poster_path}`)])
                    .buttons([
                        builder.CardAction.imBack(session, `Voir bande annonce ${data.title}`, 'Bande d\'annonce')
                    ])
            })
            const reply = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(nowPlaying)
            session.endDialog(reply)
        }
    ]).triggerAction({ matches: 'nowPlaying' })
    bot.beginDialogAction('currentMovie', 'nowPlaying')
}