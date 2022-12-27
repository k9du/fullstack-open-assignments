const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
// ehk middleware täs
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')

const middleware = require('./utils/middleware')


// Avoid warnings or whatever
mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB', error.message)
    })

    app.use(cors())
    app.use(express.json())

    app.use(middleware.tokenExtractor)

    app.use('/api/blogs', middleware.userExtractor, blogsRouter)
    app.use('/api/users', usersRouter)
    app.use('/api/login', loginRouter)

    app.use(middleware.unknownEndpoint)
    app.use(middleware.errorHandler)
    
    module.exports = app