const {promisify} = require('util')
const mailer = require('nodemailer')
const CommandJob = require('./CommandJob')
const log = (...args) => console.log(new Date(), ...args)

class MoniCron {
  constructor (config = {}) {
    const s = this
    const {
      scripts,
      stmp,
      mail
    } = config

    const sendMailAsync = MoniCron.settingMail(stmp)

    const jobs = scripts.map(({command, schedule, failedMessage}) =>
      new CommandJob({
        command,
        schedule,
        onFailed: () => {
          log(`Send mail because command failed: "${command}"`)
          sendMailAsync(Object.assign({
            text: failedMessage
          }, mail))
           .then((result) => log(JSON.stringify(result)))
        }
      })
    )
    s.jobs = jobs
  }

  static settingMail (stmpSettings) {
    const transporter = mailer.createTransport(stmpSettings)
    const sendMailAsync = promisify(transporter.sendMail.bind(transporter))
    return sendMailAsync
  }

  start () {
    this.jobs.forEach((job) => job.start())
  }

  stop () {
    this.jobs.forEach((job) => job.stop())
  }
}

module.exports = MoniCron
