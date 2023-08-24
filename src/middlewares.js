const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('./config')
const { notAuthenticated } = require('./errors')

exports.authentication = (req, res, next) => {
    const authHeader = req.headers['authorization']
    let statusCode = notAuthenticated.statusCode
    let message = notAuthenticated.message

    if (!authHeader)
        return res.status(statusCode)
            .json({ error: message })

    const [_, token] = authHeader.split(' ')

    if (!token)
        return res.status(statusCode)
            .json({ error: message })

    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(statusCode)
                .json({ error: message })
        }

        req.userId = payload.sub
        next()
    })
}