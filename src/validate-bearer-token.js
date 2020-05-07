
const { API_KEY } = require('./config')
const logger = require('./logger')

function validateBearerToken(req, res, next) {
    // console.log(req.get('Authorization'))
    const authToken = req.get('Authorization')
    logger.error(`Unauthorized request to path: ${req.path}`)
    console.log(authToken.split(' ')[1])
    console.log(API_KEY)
    if (!authToken || authToken.split(' ')[1] !== API_KEY) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }

    next()
}

module.exports = validateBearerToken