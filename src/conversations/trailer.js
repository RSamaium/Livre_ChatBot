const builder = require('botbuilder')
const MovieService = require('../services/movie.service')

module.exports = (bot) => {
    bot.dialog('trailer', [
        (session, args, next) => {
            const movieName = args.intent.matched[2]
            if (!movieName) {
                builder.Prompts.text(session, 'Indique-moi le nom du film :)')
                return
            }
            session.dialogData.movieName = movieName
            next()
        },
        async (session, args) => {
            try {
                if (args.response) {
                    session.dialogData.movieName = args.response
                }
                const { movieName } = session.dialogData
                const [media] = await MovieService.search(movieName)
                if (!media) {
                    session.endDialog(`Je ne trouve pas votre film %s :/`, movieName)
                    return
                }
                const [video] = await MovieService.getVideos(media.id)
                const thumb = `https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`
                const url = builder.CardAction.openUrl(session, `https://www.youtube.com/watch?v=${video.key}`)
                const msg = new builder.Message(session)
                    .attachments([
                        new builder.HeroCard(session)
                            .title(media.title)
                            .text(media.overview)
                            .images([
                                builder.CardImage.create(session, thumb)
                            ])
                            .buttons([
                                url.title('Voir Bande Annonce')
                            ])
                            .tap(url)
                    ])
                session.endDialog(msg)
            }
            catch (err) {
                session.error(err)
            }
        }
    ]).triggerAction({ matches: /(voir|montrer) bande annonce(.*)?/i })
}