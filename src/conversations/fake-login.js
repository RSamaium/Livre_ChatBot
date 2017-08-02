const builder = require('botbuilder')
const config = require('../config')

module.exports = (bot) => {
    bot.dialog('fakeLogin', [
        (session, args, next) => {
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
                                        url: `${config.url}/public/views/login.html`
                                    }]
                                }]
                            }
                        }
                    }
                })
            session.send(message)
        }
    ]).triggerAction({ matches: /fake login/i })
    
    bot.dialog('logout', (session) => {
        session.userData.authToken = null 
        session.endDialog('Deconnexion effectuée')
    }).triggerAction({ matches: /logout/i })
}