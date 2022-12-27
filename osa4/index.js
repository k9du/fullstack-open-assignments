const app = require('./app')
const http = require('http')
const morganBody = require('morgan-body')
const config = require('./utils/config')
const logger = require('./utils/logger')
morganBody(app)
// Logs bodys of res and req
const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
