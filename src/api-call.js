module.exports = () => {
    const config = require('./config')
    const fetch = require("node-fetch");
    fetch(config.API_TOKEN_ENDPOINT,
        {
            method: 'POST',
            mode: "cors",
            headers: {
                'Authorization': `Bearer ${config.API_TOKEN_KEY}`,
                'content-type': 'x-www-form-urlencoded',
            },
            body: {
                grant_type: "client_credentials"
            }
        })
        .then((res) => {
            if (res.ok)
                return res.json().then(e => Promise.reject(e));


            return res.json();
        })
        .then((apiKey) => {
            console.log(apiKey)

        })
        .catch(error => {
            console.error({ error });
        });
}
