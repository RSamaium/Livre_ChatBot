const builder = require('botbuilder')
const ListService = require('../services/list.service')

module.exports = (bot) => {
    bot.dialog('listAuth', [
        (session, args) => {
            if (!session.userData.authToken) {
                session.send('Connecte-toi d\'abord !')
                session.beginDialog('login')
                return
            }
            session.endDialogWithResult({
                response: true
            })
        }
    ])

    bot.dialog('addList', [
        (session, args) => {
            session.beginDialog('listAuth')
        },
        (session, args, next) => {
            builder.Prompts.text(session, 'Quel nom veux-tu donner à la liste ?');
        },
        async (session, args, next) => {
            const name = args.response
            const { authToken } = session.userData
            const listId = await ListService.create(authToken, { name, description: '' })
            session.endDialog(`La liste ${name} a bien été créée`)
        }
    ]).triggerAction({ matches: /ajouter liste/i })

    bot.dialog('viewList', [
        (session, args) => {
            if (args) {
                session.dialogData.noPrompt = args.noPrompt
            }
            session.beginDialog('listAuth')
        },
        async (session, args, next) => {
            const { authToken } = session.userData
            let list
            try {
                list = await ListService.getList(authToken)
            }
            catch (err) {
                session.error(err)
                return
            }
            if (list.length === 0) {
                const msg = new builder.Message(session)
                    .attachments([
                        new builder.HeroCard(session)
                            .text('Vous n\'avez pas de liste')
                            .buttons([
                                builder.CardAction.imBack(session, 'Ajouter liste', 'Ajouter une liste')
                            ])
                    ])
                session.endDialog(msg)
                return
            }
            if (!session.dialogData.noPrompt) {
                session.send('Voici les listes :')
                session.send(list.map(l => l.name).join(', '))
            }
            session.endDialogWithResult({ response: list })
        }
    ]).triggerAction({ matches: /voir liste/i })

    bot.dialog('listAddMovie', [
        (session, args) => {
            session.dialogData.mediaId = args.data
            session.beginDialog('viewList', { noPrompt: true })
        },
        (session, args) => {
            const { response } = args
            if (!response) {
                session.cancelDialog()
                return
            }
            session.dialogData.lists = response
            builder.Prompts.choice(session, 'Choisissez une liste', response.map(r => r.name))
        },
        async (session, args) => {
            const { entity } = args.response
            const { lists } = session.dialogData
            const { id } = lists.find(list => list.name === entity)
            try {
                await ListService.addMovie(
                    session.userData.authToken,
                    id,
                    session.dialogData.mediaId
                )
                session.endDialog('Film ajouté !')
            }
            catch (err) {
                session.error(err)
            }
        }
    ])

     bot.dialog('removeList', [
        (session, args) => {
            session.beginDialog('listAuth')
        },
        async (session, args, next) => {
            const { authToken } = session.userData
            await ListService.removeAllList(authToken)
            session.endDialog(`Les listes ont été supprimées`)
        }
    ]).triggerAction({ matches: /supprimer liste/i })

    bot.beginDialogAction('listAddAction', 'listAddMovie')
    bot.beginDialogAction('list', 'viewList')
    bot.beginDialogAction('addList', 'addList')
}