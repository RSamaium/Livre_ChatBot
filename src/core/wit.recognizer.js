const { Wit } = require('node-wit')

class WitRecognizer {

    constructor(token) {
        this.client = new Wit({
            accessToken: token
        })
    }

    async recognize(context, done) {
        const { text } = context.message
        try {
            const data = await this.client.message(text)
            const { entities } = data
            const firstIntent = entities.intent[0]
            let params = {}
            for (let entity in entities) {
                //params[entity] = entities[entity].map(intent => intent.value)
                params[entity] = entities[entity][0].value
            }
            done(null, {
                score: firstIntent.confidence,
                intent: firstIntent.value,
                params
            })
        }
        catch (err) {
            done(err)
        }
    }

}

module.exports = WitRecognizer