const CommandJob = require('../lib/CommandJob')
const {strictEqual} = require('assert')
const asleep = require('asleep')
const after = (milisecond) => new Date(Number(new Date()) + milisecond)

describe('CommandJob', () => {
  it('Do test', async () => {
    {
      let successed = false
      const job = new CommandJob({
        command: 'echo hoge',
        schedule: after(100),
        onSuccess: () => { successed = true }
      })
      job.start()
      await asleep(300)
      strictEqual(successed, true)
    }

    {
      let successed = true
      const job = new CommandJob({
        command: 'test 1 == 0',
        schedule: after(100),
        onFailed: () => { successed = false }
      })
      job.start()
      await asleep(300)
      strictEqual(successed, false)
    }
  })
})

/* global describe it */
