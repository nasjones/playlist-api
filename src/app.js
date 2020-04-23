require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const api_call = require('./api-call')
const fetch = require("node-fetch");
const app = express()
const config = require('./config')

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
// api_call();
app.get('/', (req, res) => {
    // api_call()
    console.log(config.API_TOKEN_ENDPOINT);
    console.log(config.API_TOKEN_KEY);
    fetch(config.API_TOKEN_ENDPOINT,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${config.API_TOKEN_KEY}`,
                'content-type': 'x-www-form-urlencoded',
            },
            body: {
                'grant_type': 'client_credentials'
            }
        })
        .then((result) => {
            if (!result.ok)
                return result.json().then(e => Promise.reject(e));

            return result.json()
        })
        .then((output) => {
            res.send(output)

        })
        .catch(error => {
            console.error({ error });
        });
    // res.send()
})

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

app.use(cors())

module.exports = app