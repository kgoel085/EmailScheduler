require('dotenv').config() // Load env file
const bodyParser = require('body-parser')
const helmet = require('helmet')
const routes = require('./../../routes')
const cors = require('cors')
const morgan = require('morgan')
const trimRequest = require('trim-request')

module.exports = async ({ app }) => {
  // Logger
  app.use(morgan('combined'))

  // Body parser
  app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
  app.use(bodyParser.json()) // parse application/json

  // Trim all request
  app.use(trimRequest.all)

  // Helmet Http headers
  app.use(helmet())

  // Cors
  const AppUrl = process.env.APP_URL || 'http://localhost'
  const AppPort = process.env.PORT || 3000

  const whitelist = [`${AppUrl}:${AppPort}`]
  const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !!origin === false) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }

  app.use(cors(corsOptions))

  // Routes
  app.use(routes)

  console.log('Express Initialized')
  return app
}
