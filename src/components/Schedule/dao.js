const mongoose = require('mongoose')
const schema = require('./schema')

schema.statics = {
  getObjectId: function (id = null) { // Convert String type to ObjectId type
    if (!!id === false) return null
    return mongoose.Types.ObjectId(id.toString())
  },

  getAllSchedules: function (opts = {}) { // Get all saved schedules
    return this.find({ ...opts }, [], {
      sort: { createdAt: -1 }
    }).sort()
  },

  findScheduleById: function (id, opts = {}) { // Find schedule using primary id
    const _id = (typeof id === 'string') ? this.getObjectId(id) : id
    const optsToFind = { _id, isActive: true, ...opts }
    return this.findOne(optsToFind)
  },

  updateById: function (id = null, updateParams = {}) { // Update schedule row
    const _id = (typeof id === 'string') ? this.getObjectId(id) : id
    return new Promise((resolve, reject) => {
      this.findOneAndUpdate(
        { _id },
        { $set: updateParams },
        { new: true },
        (err, doc) => {
          if (!!err === true) return reject(err)
          return resolve(doc)
        }
      )
    })
  }
}

const scheduleModel = mongoose.model('schedules', schema)
module.exports = scheduleModel
