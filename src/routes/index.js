const express = require('express')
const router = express.Router()
const AppError = require('../components/Error') // Error Class
const { hasOwnProperty } = require('./../helpers')

// Email routes
const scheduleRoutes = require('./../components/Schedule/routes')
router.use('/schedule', scheduleRoutes)

router.get('/', (req, res, nxt) => {
  return res.send('OK')
})

// -------------------------------------------------- Error Handling

// *** Not found page
router.use((req, res, nxt) => {
  const error = new AppError('Not Found !', 404, 'Page not found !')
  nxt(error)
})

// *** Unexpected errors
router.use((error, req, res, nxt) => {
  res.status(error.httpCode || 500)

  console.log(error)
  const errorObj = {
    error: true,
    message: (hasOwnProperty(error, 'description') && error.description) ? error.description : 'Error Occurred !'
  }

  if (hasOwnProperty(error, 'name')) errorObj.name = error.name

  // Return error
  return res.json(errorObj)
})

module.exports = router
