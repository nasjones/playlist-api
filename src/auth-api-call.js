// module.exports = (req, res) => {
const config = require("./config");
const fetch = require("node-fetch");
const express = require("express");
const path = require("path");
const xss = require("xss");
const logger = require("./logger");
const authRouter = express.Router();

authRouter.route("/").get((req, res, next) => {
	if (!config.API_AUTH_RUN) {
		console.log("NOT RUN");
		fetch(config.API_TOKEN_ENDPOINT, {
			method: "POST",
			headers: {
				Authorization: `Basic ${config.SPOTIFY_KEY}`,
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: "grant_type=client_credentials",
		})
			.then((result) => {
				console.log("GOT RESUlt");
				if (!result.ok)
					return result.json().then((e) => Promise.reject(e));

				return result.json();
			})
			.then((output) => {
				console.log("FINAL THEN");
				config.API_AUTH_RUN = true;

				setTimeout(() => {
					config.API_AUTH_RUN = false;
				}, 3600000);
				process.env["SONG_KEY"] = output.access_token;
				res.send({ output: `Success!` });
				console.log("DONE playlists");
			})
			.catch((error) => {
				console.error({ error });
				res.send({ error });
			});
	} else res.send({ output: "Spotify API ready to go" });
});

module.exports = authRouter;
