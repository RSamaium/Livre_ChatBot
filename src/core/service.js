const _ = require('lodash')
const rp = require('request-promise')
const { URLSearchParams } = require('url')
const config = require('../config')

class Service {

    request(uri, query = {}, options = {}) {
        // Paramètre de l'URL par défaut.
        const params = new URLSearchParams()
        params.append('api_key', config.themoviedb.token)
        params.append('language', 'fr')

        // On ajoute des paramètres supplémentaires, si besoin
        for (let key in query) {
            params.append(key, query[key])
        }

        // On fusionne les options par défaut avec options personalisées
        options = _.merge({
            uri: `${config.themoviedb.apiUrl}${uri}?${params.toString()}`,
            json: true
        }, options)
        return rp(options)
    }

    action(uri, query, body = {}, options = {}) {
        options.method = 'POST'
        options.body = body
        return this.request(uri, query, options)
    }

    delete(uri, query, options = {}) {
        options.method = 'DELETE'
        return this.request(uri, query)
    }

}

module.exports = Service