const path = require('path')
const express = require('express')
const logger = require('../logger')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const bodyParser = express.json()

const serializeUser = user => ({
    id: user.id,
    email: user.email,
    nickname: user.nickname
})

usersRouter
    .route('/')
    .get((req, res, next) => {
        UsersService.getAllUsers(req.app.get('db'))
            .then(users => {
                res.json(users.map(serializeUser))
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { email, nickname } = req.body
        const newUser = { email, nickname }

        for (const field of ['email']) {
            if (!newUser[field]) {
                logger.error(`${field} is required`)
                return res.status(400).send({
                    error: { message: `'${field}' is required` }
                })
            }
        }

        const error = getUserValidationError(newUser)

        if (error) return res.status(400).send(error)

        UsersService.insertUser(
            req.app.get('db'),
            newUser
        )
            .then(user => {
                logger.info(`User with id ${user.id} created.`)
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `${user.id}`))
                    .json(serializeUser(user))
            })
            .catch(next)
    })


usersRouter
    .route('/:user_id')
    .all((req, res, next) => {
        const { user_id } = req.params
        UsersService.getById(req.app.get('db'), user_id)
            .then(user => {
                if (!user) {
                    logger.error(`User with id ${user_id} not found.`)
                    return res.status(404).json({
                        error: { message: `User Not Found` }
                    })
                }

                res.user = user
                next()
            })
            .catch(next)

    })
    .get((req, res) => {
        res.json(serializeUser(res.user))
    })
    .delete((req, res, next) => {
        const { user_id } = req.params
        UsersService.deleteUser(
            req.app.get('db'),
            user_id
        )
            .then(numRowsAffected => {
                logger.info(`User with id ${user_id} deleted.`)
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(bodyParser, (req, res, next) => {
        const { email, nickname } = req.body
        const userToUpdate = { email, nickname }

        const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            logger.error(`Invalid update without required fields`)
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'name' or 'email'`
                }
            })
        }

        const error = getUserValidationError(userToUpdate)

        if (error) return res.status(400).send(error)

        UsersService.updateUser(
            req.app.get('db'),
            req.params.user_id,
            userToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = usersRouter