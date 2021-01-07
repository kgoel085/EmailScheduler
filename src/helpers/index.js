const AppError = require('../components/Error')

module.exports = {
  // Check if object has a property available
  hasOwnProperty: (obj, key) => {
    return Object.prototype.hasOwnProperty.call(obj, key)
  },

  // Validate Date
  validateDate: (dt = null, lbl = null, showErr = false) => {
    let returnVal = null
    const lblVal = (!!lbl === true) ? lbl : 'date'
    if (!!dt === false && showErr === true) throw new AppError(`${lblVal} is required !`, 422)
    const errMsg = `Invalid ${lblVal} provided !`
    try {
      const dateObj = new Date(dt)
      returnVal = dateObj
    } catch (err) {
      if (showErr) throw new AppError(errMsg, 400)
      else return null
    }

    if (returnVal instanceof Date === false || returnVal === false) throw new AppError(errMsg, 400)
    return returnVal.toISOString()
  },

  // Validate Email
  validateEmail: (val = '', showErr = false) => {
    const filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (filter.test(String(val).toLowerCase())) return val

    const errMsg = (!!val === false) ? 'Provided email is not valid !' : `${val} is not a valid email`
    if (showErr) throw new AppError(errMsg, 400)
    return null
  },

  // Error handler
  errorHandler: (err = null) => {
    if (!!err === false) err = new AppError('Some unconditional error!', 500, 'undefined-error')
    const errStats = (err instanceof AppError) ? err.httpCode : err.code
    const errName = (err instanceof AppError) ? err.name : 'undefined-error'
    const errDesp = (err instanceof AppError) ? err.description : err.message
    throw new AppError(errDesp, errStats, errName)
  }
}
