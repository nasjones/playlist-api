require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const auth_api_call = require('./auth-api-call')
const app = express()
const genreRouter = require('./genres/genres-router')
const playlistRouter = require('./playlist/playlist-router')
// const playlistRecordsRouter = require('./playlistRecords/playlistRecords-router')
const usersRouter = require('./users/users-router')
const data_api_call = require('./data-api-call')
const validate = require('./validate-bearer-token')
const bodyParser = express.json()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(validate)
app.get('/api/auth', (req, res) => auth_api_call(req, res))
app.use('/api/data', data_api_call)
app.use('/api/genres', genreRouter)
app.use('/api/playlists', playlistRouter)
app.use('/api/users', usersRouter)

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})


module.exports = app