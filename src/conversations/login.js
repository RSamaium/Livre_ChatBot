const builder = require('botbuilder')
const config = require('../config')
const UserService = require('../services/user.service')

module.exports = function (bot) {
    bot.dialog('login', [
        async (session, args, next) => {
            let auth
            try {
                auth = await UserService.newToken()
                if (!auth.success) {
                    throw 'Token failed'
                }
            }
            catch (err) {
                return session.error(err)
            }
            const message = new builder.Message(session)
                .sourceEvent({
                    facebook: {
                        attachment: {
                            type: 'template',
                            payload: {
                                template_type: 'generic',
                                elements: [{
                                    title: 'Lier votre compte',
                                    image_url: `${config.url}/public/images/linking-icon.png`,
                                    buttons: [{
                                        type: 'account_link',
                                        url: `${config.url}/authMovieDb/${auth.request_token}`
                                    }]
                                }]
                            }
                        }
                    }
                })
            session.send(message)
        }
    ]).triggerAction({ matches: /login/i })
}