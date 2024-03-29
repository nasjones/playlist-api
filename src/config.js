require("dotenv").config();
module.exports = {
	PORT: process.env.PORT || 8000,
	NODE_ENV: process.env.NODE_ENV || "development",
	DATABASE_URL:
		process.env.DATABASE_URL || "postgresql://grape@localhost/playlist-app",
	API_TOKEN_KEY: process.env.API_TOKEN_KEY,
	API_TOKEN_ENDPOINT: process.env.API_TOKEN_ENDPOINT,
	API_FINAL_ENDPOINT: "https://api.spotify.com/v1/search?q=",
	API_AUTH_RUN: false,
	SPOTIFY_KEY: process.env.SPOTIFY_KEY,
	API_KEY: process.env.API_KEY || "b3a96222-0a62-11ec-9a03-0242ac130003",
	dialectOptions: {
		ssl: {
			rejectUnauthorized: false,
		},
	},
};
