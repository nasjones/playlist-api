require('dotenv').config()
module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://Nas@localhost/playlist',
    API_TOKEN_KEY: process.env.API_TOKEN_KEY,
    API_TOKEN_ENDPOINT: process.env.API_TOKEN_ENDPOINT,
    API_FINAL_ENDPOINT: 'https://api.spotify.com/v1/search?q='
}