const path = require("path");
const express = require("express");
const xss = require("xss");
const logger = require("../logger");
const GenresService = require("./genres-service");
// const { getGenreValidationError } = require('./genre-validator')

const genresRouter = express.Router();
const bodyParser = express.json();

const serializeGenre = (genre) => ({
	id: genre.id,
	name: xss(genre.name),
});

genresRouter
	.route("/")
	.get((req, res, next) => {
		console.log("Getting genres");
		GenresService.getAllGenres(req.app.get("db"))
			.then((genres) => {
				res.json(genres.map(serializeGenre));
				console.log("DONE genres");
			})
			.catch(next);
	})
	.post(bodyParser, (req, res, next) => {
		const { name } = req.body;
		const newGenre = { name };

		for (const field of ["email"]) {
			if (!newGenre[field]) {
				logger.error(`${field} is required`);
				return res.status(400).send({
					error: { message: `'${field}' is required` },
				});
			}
		}

		const error = getGenreValidationError(newGenre);

		if (error) return res.status(400).send(error);

		GenresService.insertGenre(req.app.get("db"), newGenre)
			.then((genre) => {
				logger.info(`Genre with id ${genre.id} created.`);
				res.status(201)
					.location(path.posix.join(req.originalUrl, `${genre.id}`))
					.json(serializeGenre(genre));
			})
			.catch(next);
	});

genresRouter
	.route("/:genre_id")
	.all((req, res, next) => {
		const { genre_id } = req.params;
		GenresService.getById(req.app.get("db"), genre_id)
			.then((genre) => {
				if (!genre) {
					logger.error(`Genre with id ${genre_id} not found.`);
					return res.status(404).json({
						error: { message: `Genre Not Found` },
					});
				}
				console.log(genre);

				res.genre = genre;
				next();
			})
			.catch(next);
	})
	.get((req, res) => {
		res.json(serializeGenre(res.genre));
	})
	.delete((req, res, next) => {
		const { genre_id } = req.params;
		GenresService.deleteGenre(req.app.get("db"), genre_id)
			.then((numRowsAffected) => {
				logger.info(`Genre with id ${genre_id} deleted.`);
				res.status(204).end();
			})
			.catch(next);
	})
	.patch(bodyParser, (req, res, next) => {
		const { name } = req.body;
		const genreToUpdate = { name };

		const numberOfValues =
			Object.values(genreToUpdate).filter(Boolean).length;
		if (numberOfValues === 0) {
			logger.error(`Invalid update without required fields`);
			return res.status(400).json({
				error: {
					message: `Request body must contain name`,
				},
			});
		}

		const error = getGenreValidationError(genreToUpdate);

		if (error) return res.status(400).send(error);

		GenresService.updateGenre(
			req.app.get("db"),
			req.params.genre_id,
			genreToUpdate
		)
			.then((numRowsAffected) => {
				res.status(204).end();
			})
			.catch(next);
	});

module.exports = genresRouter;
