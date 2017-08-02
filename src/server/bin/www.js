const connector = require('../../setup/chat-connector')
const bot = require('../../setup/bot')(connector)
const app = require('../app')

app.set('bot', bot)

app.post('/botframework/receive', connector.listen())

app.listen(process.env.PORT || 3000,  () => {
  console.log('app run')
})

module.exports = app
