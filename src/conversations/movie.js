const builder = require('botbuilder')
const config = require('../config')
const MovieService = require('../services/movie.service')
const GenreService = require('../services/genre.service')

module.exports = (bot) => {

    let choices = {}

    bot.dialog('discover', [
        async (session, args) => {
            const genres = await GenreService.fetch()
            for (let g of genres) {
                choices[g.name] = g.id
            }
            builder.Prompts.choice(session, 'Quel est votre genre de film ?', choices)
        },
        async (session, args) => {
            const genreId = choices[args.response.entity]
            let discover = await MovieService.discover({
                with_genres: genreId
            })
            discover = discover.map(data => {
                return new builder.HeroCard(session)
                    .title(data.title)
                    .text(data.overview)
                    .subtitle(`${data.vote_average} / 10`)
                    .images([builder.CardImage.create(session, `${config.themoviedb.imageUrl}/${data.poster_path}`)])
                    .buttons([
                        builder.CardAction.imBack(session, `voir la bande d'annonce ${data.title}`, 'Bande d\'annonce'),
                        builder.CardAction.dialogAction(session, 'listAddAction', data.id, 'Ajouter à la liste'),
                        builder.CardAction.dialogAction(session, 'rentAction', data.id, 'Louer')
                    ])
            })
            const reply = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(discover)
            session.endDialog(reply)
        }
    ]).triggerAction({ matches: /découvrir/i })

    bot.beginDialogAction('findMovie', 'discover')

}