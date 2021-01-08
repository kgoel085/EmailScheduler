const { Schema } = require('mongoose')
const { validateEmail } = require('../../helpers')

const errEmailMsg = 'Please provide a valid email'

const schemaFields = {
  from: { // Sender of email
    type: String,
    required: true,
    validate: [validateEmail, errEmailMsg]
  },
  to: { // Recipient of email
    type: String,
    required: true,
    validate: [validateEmail, errEmailMsg]
  },
  body: { // Content of email
    type: String,
    required: true
  },
  scheduledFor: { // Delivery time for email
    type: Date,
    required: true
  },
  isProcessed: { // Email processed or not. 0 -> pending, 1 -> processing, 2 -> processed
    type: Number,
    default: 0
  },
  isSent: { // Whether email is ent from our side or not
    type: Boolean,
    default: false
  },
  sentAt: { // When email was sent
    type: Date,
    default: null
  },
  isActive: { // Whether this schedule is active/deleted or not
    type: Boolean,
    default: true
  },
  errorInfo: { // If any error while sending save it here
    type: String,
    default: null
  }
}
const emailSchema = new Schema(schemaFields, {
  timestamps: true
})
module.exports = emailSchema
