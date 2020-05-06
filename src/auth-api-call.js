module.exports = (req, res) => {
    const config = require('./config')
    const fetch = require("node-fetch");
    console.log(config.API_AUTH_RUN)
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



}
