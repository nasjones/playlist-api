const path = require("path");
const express = require("express");
const xss = require("xss");
const logger = require("../logger");
const PlaylistsService = require("./playlist-service");

const playlistsRouter = express.Router();
const bodyParser = express.json();

const serializePlaylist = (playlist) => ({
	id: playlist.id,
	title: xss(playlist.title),
	genre_id: playlist.genre_id,
	length: xss(playlist.length),
});

const serializePlaylistWithGenre = (playlist) => ({
	id: playlist.id,
	title: xss(playlist.title),
	genre_id: playlist.genre_id,
	length: xss(playlist.length),
	genre_name: xss(playlist.name),
});

playlistsRouter
	.route("/")
	.get((req, res, next) => {
		PlaylistsService.getAllPlaylists(req.app.get("db"))
			.then((playlists) => {
				res.json(playlists.map(serializePlaylist));
			})
			.catch(next);
	})
	.post(bodyParser, (req, res, next) => {
		const { title, length, genre_id, author } = req.body;
		const newPlaylist = {
			title,
			length,
			genre_id,
			author,
		};
		for (const field of ["title", "length", "genre_id"]) {
			if (!newPlaylist[field]) {
				logger.error(`${field} is required`);
				return res.status(400).send({
					error: { message: `'${field}' is required` },
				});
			}
		}

		PlaylistsService.insertPlaylist(req.app.get("db"), newPlaylist)
			.then((playlist) => {
				logger.info(`Playlist with id ${playlist.id} created.`);
				res.status(201)
					.location(
						path.posix.join(req.originalUrl, `${playlist.id}`)
					)
					.json(serializePlaylist(playlist));
			})
			.catch(next);
	});

playlistsRouter
	.route("/:playlist_id")
	.all((req, res, next) => {
		const { playlist_id } = req.params;
		PlaylistsService.getById(req.app.get("db"), playlist_id)
			.then((playlist) => {
				if (!playlist) {
					logger.error(`Playlist with id ${playlist_id} not found.`);
					return res.status(404).json({
						error: { message: `Playlist Not Found` },
					});
				}
				console.log(playlist);

				res.playlist = playlist;
				next();
			})
			.catch(next);
	})
	.get((req, res) => {
		res.json(serializePlaylistWithGenre(res.playlist));
	})
	.delete((req, res, next) => {
		const { playlist_id } = req.params;
		PlaylistsService.deletePlaylist(req.app.get("db"), playlist_id)
			.then((numRowsAffected) => {
				logger.info(`Playlist with id ${playlist_id} deleted.`);
				res.status(204).end();
			})
			.catch(next);
	})
	.patch(bodyParser, (req, res, next) => {
		const { title } = req.body;
		const playlistToUpdate = { title };

		const numberOfValues =
			Object.values(playlistToUpdate).filter(Boolean).length;
		if (numberOfValues === 0) {
			logger.error(`Invalid update without required fields`);
			return res.status(400).json({
				error: {
					message: `Request body must contain title`,
				},
			});
		}

		const error = getPlaylistValidationError(playlistToUpdate);

		if (error) return res.status(400).send(error);

		PlaylistsService.updatePlaylist(
			req.app.get("db"),
			req.params.playlist_id,
			playlistToUpdate
		)
			.then((numRowsAffected) => {
				res.status(204).end();
			})
			.catch(next);
	});

module.exports = playlistsRouter;
