const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const config = require('../config')
const UserService = require('../services/user.service')
const MovieService = require('../services/movie.service')
const rp = require('request-promise')
const stripe = require('stripe')(config.stripe.token)

const app = express()

app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})

app.use('/public', express.static(path.join(__dirname, 'public')))

app.get('/authMovieDb/approved', async (req, res, next) => {
  const {
    redirect_uri: redirectUri,
    account_linking_token: accountLink,
    request_token: token
  } = req.query
  const sessionId = await UserService.newSession(token)
  return res.redirect(`${redirectUri}?account_linking_token=${accountLink}&authorization_code=${sessionId}`)
})

app.get('/authMovieDb/:token', (req, res, next) => {
  const { redirect_uri: redirectUri } = req.query
  const { token } = req.params
  const redirectTo = `${config.url}/authMovieDb/approved?redirect_uri=${redirectUri}`
  return res.redirect(`${config.themoviedb.siteUrl}/authenticate/${token}?redirect_to=${redirectTo}`)
})

app.get('/movie/:movieId', async (req, res, next) => {
  const { movieId } = req.params
  try {
    const movie = await MovieService.get(movieId)
    res.json(movie)
  }
  catch (err) {
    next(err)
  }
})

app.post('/buy/:movieId', async (req, res, next) => {
  const { stripeToken, address } = req.body
  const { movieId } = req.params
  const bot = app.get('bot')
  try {
    const movie = await MovieService.get(movieId)
    const charge = await stripe.charges.create({
      amount: movie.amount * 100,
      currency: 'eur',
      description: `Louer film ${movie.title}`,
      source: stripeToken.id
    })
    bot.beginDialog(address, 'movieRentedSuccess', { movie, charge })
    res.json(charge)
  }
  catch (err) {
    next(err)
  }
})

module.exports = app