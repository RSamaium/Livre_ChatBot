const Service = require('../core/service')

class UserService extends Service {

    newToken() {
        return this.request('/authentication/token/new')
    }

    newSession(requestToken) {
        return this.request('/authentication/session/new', {
            request_token: requestToken
        }).then(res => res.session_id)
    }

    account(sessionId) {
        return this.request('/account', {
            session_id: sessionId
        })
    }

}

module.exports = new UserService()