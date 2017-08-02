const Service = require('../core/service')
const UserService = require('./user.service')

class ListService extends Service {

    create(sessionId, data) {
        return this.action('/list', {
            session_id: sessionId
        }, data).then(res => res.list_id)
    }

    addMovie(sessionId, listId, mediaId) {
        return this.action(`/list/${listId}/add_item`, {
            session_id: sessionId
        }, {
                media_id: mediaId
            })
    }

    async removeAllList(sessionId) {
        const lists = await this.getList(sessionId)
        for (let list of lists) {
            await this.delete(`/list/${list.id}`, {
                session_id: sessionId
            })
        }
    }

    async getList(sessionId) {
        const { id } = await UserService.account(sessionId)
        return this.request(`/account/${id}/lists`, {
            session_id: sessionId
        }).then(res => res.results)
    }

}

module.exports = new ListService()