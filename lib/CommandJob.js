const R = require('ramda')
const {CronJob} = require('cron')
const {exec} = require('child_process')
const {promisify} = require('util')
const execAsync = promisify(exec)
const execThenSuccess = (command) => execAsync(command).then(R.always(true)).catch(R.always(false))

class CommandJob {
  constructor ({command, schedule, onSuccess = () => {}, onFailed = () => {}}) {
    const s = this
    const jobFunc = async () => {
      const success = await execThenSuccess(command)
      if (success) {
        onSuccess()
      } else {
        onFailed()
      }
    }
    s.job = new CronJob(schedule, jobFunc)
  }

  start () {
    this.job.start()
  }
  stop () {
    this.job.stop()
  }
}

module.exports = CommandJob
