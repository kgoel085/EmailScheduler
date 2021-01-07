const mailer = require('nodemailer')
const { host, port, user, pass } = require('./../../config/mailer')

module.exports = (to = null, body = null) => {
  return new Promise((resolve, reject) => {
    // Create transporter
    const transport = mailer.createTransport({
      host,
      port,
      auth: {
        user,
        pass
      }
    })

    const mailOptions = {
      to,
      subject: 'Test Email from Node',
      text: body
    }

    transport.sendMail(mailOptions, (error, info) => {
      if (error) return reject(error)
      return resolve(info)
    })
  })
}
