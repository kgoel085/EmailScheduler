// Loaders
const loaders = require('./src/loaders')
const express = require('express')

const app = express()
loaders({ expressApp: app })

// Start the server listening
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server started on POST: ${port}`)
})

module.exports = app
