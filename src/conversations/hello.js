module.exports = (bot) => {
    bot.dialog('hello', [
        (session, args) => {
            session.endDialog(['Salut', 'Bonjour'])
        }
    ]).triggerAction({ matches: /hello/i })
    bot.beginDialogAction('go', 'hello')
}