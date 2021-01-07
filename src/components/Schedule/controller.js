const AppError = require('../Error')
const { createScheduleRow, getSchedules, updateSchedule, deleteSchedule } = require('./api')

module.exports = {
  createSchedule: (req, res, nxt) => { // Create email schedule
    return createScheduleRow(req.body)
      .then(data => {
        if (!!data === false) throw new AppError('Error while creating schedule!', 400)
        return res.json({
          data,
          message: 'Schedule created.'
        })
      })
      .catch(nxt)
  },

  getSchedules: (req, res, nxt) => { // Get all the stored schedules
    return getSchedules()
      .then(data => {
        return res.json({
          data
        })
      })
      .catch(nxt)
  },

  updateSchedule: (req, res, nxt) => { // Update a schedule
    return updateSchedule(req.body)
      .then(data => {
        if (!!data === false) throw new AppError('Error while updating schedule !', 400)
        return res.json({
          data,
          message: 'Schedule updated.'
        })
      })
      .catch(nxt)
  },

  deleteSchedule: (req, res, nxt) => { // Mark a schedule as inactive
    return deleteSchedule(req.params.identifier)
      .then(data => {
        if (!!data === false) throw new AppError('Error while processing your request.', 400)
        return res.json({
          message: 'Schedule deleted'
        })
      })
      .catch(nxt)
  }
}
