const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const unknownEndpoint = (request, response, next) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({
        error: 'invalid token'
      })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        })
    }
  
    next(error)
}
  

const tokenExtractor = (request, response, next) => {
    const getTokenFrom = (request) => {
        const authorization = request.get('Authorization')
        if ( authorization && authorization.toLowerCase().startsWith('bearer ')) {
            return authorization.substring(7)
        }
        return null
    }

    const token = getTokenFrom(request)

    request.token = token
    next()
}

const userExtractor = (request, response, next) => {
    if (!request.token) {
        return response.status(401).json({ error: 'check token'})
    }
    try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
    
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid'})
        }
    
        const user = User.findById(decodedToken.id)
    
        request.user = user
    } catch (error) {
        next(error)
    }
    next()
}

module.exports = {
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}