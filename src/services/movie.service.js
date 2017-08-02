const Service = require('../core/service')

class MovieService extends Service {
	
	nowPlaying() {
        return this.request('/movie/now_playing')
            .then(res => res.results)
    }

    search(query) {
        return this.request('/search/movie', { query })
            .then(res => res.results)
    }

    discover(options) {
        return this.request('/discover/movie', options)
            .then(res => res.results)
    }

    getVideos(movieId) {
        return this.request(`/movie/${movieId}/videos`)
            .then(res => res.results)
    }

    get(movieId) {
        return this.request(`/movie/${movieId}`).then(movie => {
			// Ajout d'une fausse donnée car l'API n'a pas de prix de location
            movie.amount = 3.99
            return movie
        })
    }

}

module.exports = new MovieService()