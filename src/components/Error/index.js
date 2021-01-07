// centralized error object that derives from Node’s Error
class AppError {
  constructor (description = null, httpCode = null, name = null) {
    Error.call(this)
    Error.captureStackTrace(this)
    this.name = name
    this.httpCode = httpCode
    this.description = description
  }
}

AppError.prototype = Object.create(Error.prototype)
AppError.prototype.constructor = AppError

module.exports = AppError
