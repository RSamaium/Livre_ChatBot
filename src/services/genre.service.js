const Service = require('../core/service')

class GenreService extends Service {

    fetch() {
        return this.request('/genre/movie/list').then(res => res.genres)
    }

}

module.exports = new GenreService()