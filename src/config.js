require('dotenv').config()
module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL:  'postgresql://grape@localhost/playlist-app',
    // process.env.DATABASE_URL ||
    API_TOKEN_KEY: process.env.API_TOKEN_KEY,
    API_TOKEN_ENDPOINT: process.env.API_TOKEN_ENDPOINT,
    API_FINAL_ENDPOINT: 'https://api.spotify.com/v1/search?q=',
    API_AUTH_RUN: false,
    API_KEY: process.env.API_KEY,
    REACT_KEY:process.env.REACT_KEY
}