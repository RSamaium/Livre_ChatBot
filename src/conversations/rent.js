const builder = require('botbuilder')
const config = require('../config')
const MovieService = require('../services/movie.service')

module.exports = (bot) => {

    bot.dialog('rent', [
        async (session, args) => {
            const movieId = args.data
            const address = encodeURIComponent(JSON.stringify(session.message.address))
            let movie
            try {
                movie = await MovieService.get(movieId)
            }
            catch (err) {
                return session.error(err)
            }
            const url = `${config.url}/public/views/rent.html?id=${movieId}&address=${address}`
            const msg = new builder.Message(session)
                .sourceEvent({
                    facebook: {
                        attachment: {
                            type: 'template',
                            payload: {
                                template_type: 'button',
                                text: `Louer le film ${movie.title}`,
                                buttons: [{
                                    type: 'web_url',
                                    url,
                                    title: `Louer (${movie.amount} €)`,
                                    webview_height_ratio: 'full',
                                    messenger_extensions: true
                                }]
                            }
                        }
                    }
                })
            session.endDialog(msg)
        }
    ])

    bot.dialog('movieRentedSuccess', [
        (session, args = {}) => {
            const { movie, charge } = args
            const { source } = charge
            const msg = new builder.Message(session)
                .attachments([
                    new builder.HeroCard(session)
                        .text(`Commencer la lecture du film ${movie.title}`)
                        .images([
                            builder.CardImage.create(session, `${config.themoviedb.imageUrl}/${movie.poster_path}`)
                        ])
                        .buttons([
                            builder.CardAction.imBack(session, 'Voir le film', 'Voir le film')
                        ])
                ])

            session.send(`Merci d'avoir loué le film ${movie.title}`)
            session.endDialog(msg)
        }
    ])

    bot.beginDialogAction('rentAction', 'rent')

}