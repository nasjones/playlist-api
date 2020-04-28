module.exports = (req, res) => {
    const config = require('./config')
    const fetch = require("node-fetch");
    let apiObject
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
            process.env['API_KEY'] = output.access_token
            res.send("Success!")
        })
        .catch(error => {
            console.error({ error });
        });



}
