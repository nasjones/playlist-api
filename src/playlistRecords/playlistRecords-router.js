const path = require('path')
const express = require('express')
const xss = require('xss')
const logger = require('../logger')
const PlaylistRecordsService = require('./playlistRecords-service')
// const { getPlaylistRecordValidationError } = require('./playlist-validator')

const playlistsRouter = express.Router()
const bodyParser = express.json()

const serializePlaylistRecord = record => ({
    id: record.id,
    playlist: record.playlist_id,
    genre: record.genre_id
})

playlistsRouter
    .route('/')
    .get((req, res, next) => {
        PlaylistRecordsService.getAllPlaylistRecords(req.app.get('db'))
            .then(playlists => {
                res.json(playlists.map(serializePlaylistRecord))
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { playlist_id, genre_id } = req.body
        const newPlaylistRecord = { playlist_id, genre_id }

        for (const field of ['playlist_id', 'genre_id']) {
            if (!newPlaylistRecord[field]) {
                logger.error(`${field} is required`)
                return res.status(400).send({
                    error: { message: `'${field}' is required` }
                })
            }
        }

        // const error = getPlaylistRecordValidationError(newPlaylistRecord)

        // if (error) return res.status(400).send(error)

        PlaylistRecordsService.insertPlaylistRecord(
            req.app.get('db'),
            newPlaylistRecord
        )
            .then(playlist => {
                logger.info(`PlaylistRecord with id ${playlist.id} created.`)
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `${playlist.id}`))
                    .json(serializePlaylistRecord(playlist))
            })
            .catch(next)
    })


playlistsRouter
    .route('/:playlist_id')
    .all((req, res, next) => {
        const { playlist_id } = req.params
        PlaylistRecordsService.getById(req.app.get('db'), playlist_id)
            .then(playlist => {
                if (!playlist) {
                    logger.error(`PlaylistRecord with id ${playlist_id} not found.`)
                    return res.status(404).json({
                        error: { message: `PlaylistRecord Not Found` }
                    })
                }

                res.playlist = playlist
                next()
            })
            .catch(next)

    })
    .get((req, res) => {
        res.json(serializePlaylistRecord(res.playlist))
    })
    .delete((req, res, next) => {
        const { playlist_id } = req.params
        PlaylistRecordsService.deletePlaylistRecord(
            req.app.get('db'),
            playlist_id
        )
            .then(numRowsAffected => {
                logger.info(`PlaylistRecord with id ${playlist_id} deleted.`)
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(bodyParser, (req, res, next) => {
        const { playlist, genre } = req.body
        const playlistToUpdate = { playlist, genre }

        const numberOfValues = Object.values(playlistToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            logger.error(`Invalid update without required fields`)
            return res.status(400).json({
                error: {
                    message: `Request body must contain 'playlist', 'genre'`
                }
            })
        }

        const error = getPlaylistRecordValidationError(playlistToUpdate)

        if (error) return res.status(400).send(error)

        PlaylistRecordsService.updatePlaylistRecord(
            req.app.get('db'),
            req.params.playlist_id,
            playlistToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = playlistsRouter