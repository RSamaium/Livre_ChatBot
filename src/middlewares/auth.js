const builder = require('botbuilder')

module.exports = (bot) => {
    bot.use({
        botbuilder(session, next) {
            const { message } = session
            if (!message.sourceEvent) {
                next()
                return
            }
            const { account_linking: accountLinking } = message.sourceEvent
            if (accountLinking && accountLinking.status === 'linked') {
                session.userData.authToken = accountLinking.authorization_code
                session.send('Tu es bien connecté !')
                session.endDialogWithResult({
                    response: true
                })
            }
            else {
                next()
            }
        }
    })
}