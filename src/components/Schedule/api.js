const { errorHandler, validateEmail, validateDate, hasOwnProperty } = require('../../helpers')
const AppError = require('../Error')
const DAO = require('./dao')
const sendEmailViaMailer = require('./../Mail')

const apiObject = {
  // Create a schedule
  createScheduleRow: (reqScheduleBody = {}) => {
    const scheduleBody = apiObject.validateScheduleBody(reqScheduleBody)
    return DAO.create(scheduleBody)
      .then(data => {
        if (!!data === false) throw new AppError('Error while creating schedule!', 400)
        return data
      })
      .catch(errorHandler)
  },

  // Get all schedules
  getSchedules: (filters = {}) => {
    const filterObj = {
      isActive: true
    }
    if (!!filters === true) {
      if (hasOwnProperty(filters, 'type') && !!filters.type === true) {
        switch (filters.type.toLowerCase()) {
          case 'success':
            filterObj.isProcessed = 2
            filterObj.isSent = true
            break
          case 'fail':
            filterObj.isProcessed = 2
            filterObj.isSent = false
            break

          case 'pending':
            filterObj.isProcessed = 0
            filterObj.isSent = false
            break

          case 'delete':
            filterObj.isActive = false
            break
        }
      }
    }

    return DAO.getAllSchedules(filterObj)
      .then(data => {
        if (!!data === false) return []
        return data
      })
      .catch(errorHandler)
  },

  // Get unprocessed schedules
  getUnProcessedSchedules: () => {
    return DAO.getAllSchedules({ isProcessed: 0, isActive: true, scheduledFor: { $lt: new Date().toISOString() } })
      .then(data => {
        if (!!data === false) return []
        return data
      })
      .catch(errorHandler)
  },

  // Process scheduled emails
  processSchedules: () => {
    return apiObject.getUnProcessedSchedules()
      .then(data => apiObject.markScheduleProcessStatus(data))
      .then(scheduleData => apiObject.processEmails(scheduleData))
      .catch(errorHandler)
  },

  // Process the scheduled email
  processEmails: (schedules = []) => {
    if (!!schedules === true && schedules.length > 0) schedules.forEach(apiObject.sendEmail)
  },

  // Send Email
  sendEmail: (schedule = null) => {
    if (!!schedule === false) return null

    const { to, body, _id: scheduleId } = schedule
    return sendEmailViaMailer(to, body)
      .then(info => DAO.updateById(scheduleId, { isProcessed: 2, isSent: true, sentAt: new Date().toISOString() }))
      .catch(async err => {
        await DAO.updateById(scheduleId, { isProcessed: 2, isSent: false, errorInfo: err.message })
        errorHandler(err)
      })
  },

  // Mark schedules as processing, so that they does not come with next iteration
  markScheduleProcessStatus: async (schedules = [], status = 1) => {
    const returnVal = []
    if (!!schedules === true && schedules.length > 0) {
      for (let i = 0; i < schedules.length; i++) {
        const schedule = schedules[i]
        const updatedData = await DAO.updateById(schedule._id, { isProcessed: status })
        if (!!updatedData === true) returnVal.push(updatedData)
      }
    }

    return returnVal
  },

  // Update a schedule
  updateSchedule: (scheduleBody = {}) => {
    const { id, ...updateData } = apiObject.validateScheduleBody(scheduleBody, 'update')
    return DAO.findScheduleById(id)
      .then(schedule => {
        if (!!schedule === false) throw new AppError('No schedule found !', 400)

        const { isProcessed } = schedule
        if (isProcessed > 0) throw new AppError('Schedule already processed. Cannot update', 400)

        return DAO.updateById(schedule._id, updateData)
      })
      .catch(errorHandler)
  },

  // Mark a schedule as in-active
  deleteSchedule: (identifier = null) => {
    if (!!identifier === false) throw new AppError('Invalid schedule requested!')

    return DAO.findScheduleById(identifier)
      .then(schedule => {
        if (!!schedule === false) throw new AppError('No schedule found !', 400)
        return DAO.updateById(schedule._id, { isActive: false })
      })
      .catch(errorHandler)
  },

  // Validate schedule body
  validateScheduleBody: (scheduleBody = {}, callFrom = 'create') => {
    if (!!scheduleBody === false || Object.keys(scheduleBody).length === 0) throw new AppError('Please provide some input to create schedule !', 422)

    let { to, body, schedule, id } = scheduleBody
    let scheduleDate

    const bodyErrMsg = 'Please provide some input for email to send !'
    switch (callFrom) {
      case 'update':
        if (!!id === false) throw new AppError('Schedule identifier is required !', 422)

        // Validate Email
        if (!!to === true && validateEmail(to) === false) to = null
        // if (!!from === true && validateEmail(from) === false) from = null

        if (!!schedule === true) {
          scheduleDate = validateDate(schedule, 'Schedule date')
          if (!!scheduleDate === false) scheduleDate = null
        }

        break

      case 'create':
        if (!!body === false) throw new AppError(bodyErrMsg, 422)

        // Validate Email
        validateEmail(to, true)
        // validateEmail(from, true)

        // Validate Date
        scheduleDate = validateDate(schedule, 'Schedule date', true)
        break
    }

    // Check if date is of future
    if (!!scheduleDate === true) {
      const currentDate = new Date()
      const scheduleDateObj = new Date(scheduleDate)

      if (scheduleDateObj <= currentDate) throw new AppError('Schedule date should be greater than current date !', 400)
    }

    // Prepare Object
    const returnObj = {}
    if (!!to === true) returnObj.to = to
    // if (!!from === true) returnObj.from = from
    if (!!body === true) returnObj.body = body
    if (!!scheduleDate === true) returnObj.scheduledFor = scheduleDate

    if (Object.keys(returnObj).length === 0) throw new AppError('Please provide some input for a schedule !', 400)
    if (!!id === true && callFrom.toLowerCase() === 'update') returnObj.id = id

    return returnObj
  }
}

module.exports = apiObject
