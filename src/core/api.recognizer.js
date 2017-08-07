const apiai = require('apiai')
const uuid = require('uuid')

class ApiRecognizer {

    constructor(token) {
        this.app = apiai(token)
    }

    recognize(context, done) {
        const { text } = context.message
        const request = this.app.textRequest(text, {
            sessionId: uuid()
        })

        request.on('response', (response) => {
            const { result } = response
            done(null, {
                score: result.score,
                intent: result.action,
                params: result.parameters
            })
        })

        request.on('error', done)

        request.end()
    }

}

module.exports = ApiRecognizer