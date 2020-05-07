// module.exports = (req, res) => {
const config = require('./config')
const fetch = require("node-fetch");
const express = require('express')
const path = require('path')
const xss = require('xss')
const logger = require('./logger')
const authRouter = express.Router()

console.log(config.API_AUTH_RUN)
authRouter.route('/').get((req, res, next) => {
    if (!config.API_AUTH_RUN) {
        fetch(config.API_TOKEN_ENDPOINT,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${config.API_TOKEN_KEY}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: "grant_type=client_credentials"
            })
            .then((result) => {
                if (!result.ok)
                    return result.json().then(e => Promise.reject(e));

                return result.json()
            })
            .then((output) => {
                config.API_AUTH_RUN = true

                setTimeout(() => {
                    config.API_AUTH_RUN = false
                }, 3600000);
                process.env['API_KEY'] = output.access_token
                res.send({ output: `Success!` })
            })
            .catch(error => {
                console.error({ error });
            });
    }
    else
        res.send({ output: "Spotify API ready to go" })
})

module.exports = authRouter