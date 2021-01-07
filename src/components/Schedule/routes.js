const express = require('express')
const router = express.Router()
const { createSchedule, getSchedules, updateSchedule, deleteSchedule } = require('./controller')

router.post('/create', createSchedule) // Create schedule
router.get('/list', getSchedules) // Get schedules
router.put('/update', updateSchedule) // Update schedule
router.delete('/delete/:identifier', deleteSchedule) // Mark schedule as inactive schedule

module.exports = router
