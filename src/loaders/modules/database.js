const mongoose = require('mongoose')
const dbConfig = require('./../../config/database')

module.exports = async ({ app }) => {
  const { dbUser, dbPwd, dbHost, dbPort, dbName, dbAuthSource, dbProtocol } = dbConfig
  const dbURL = `${dbProtocol}://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPwd)}@${dbHost}:${dbPort | 27017}/${dbName}?authSource=${dbAuthSource}`

  mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })

  mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection is open')
  })

  mongoose.connection.on('error', function (err) {
    console.log(`Mongoose default connection has occurred ${err} error`)
  })

  mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection is disconnected')
  })

  process.on('SIGINT', function () {
    mongoose.connection.close(function () {
      console.log('Mongoose default connection is disconnected due to application termination')
      process.exit(0)
    })
  })

  return app
}
