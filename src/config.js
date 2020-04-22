require('dotenv').config()
module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_TOKEN_KEY: process.env.API_TOKEN_KEY,
    API_TOKEN_ENDPOINT: process.env.API_TOKEN_ENDPOINT
}