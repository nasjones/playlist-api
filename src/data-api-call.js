const path = require("path");
const express = require("express");
const xss = require("xss");
const logger = require("./logger");
const bodyParser = express.json();
const tracksRouter = express.Router();
const config = require("./config");
const fetch = require("node-fetch");

tracksRouter.route("/").post(bodyParser, (req, res, next) => {
	let finalURL = config.API_FINAL_ENDPOINT + req.body.qString;

	fetch(finalURL, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
	})
		.then((result) => {
			if (!result.ok) return result.json().then((e) => Promise.reject(e));

			return result.json();
		})
		.then((output) => {
			res.send(output);
		})
		.catch((error) => {
			console.error({ error });
		});
});

module.exports = tracksRouter;
