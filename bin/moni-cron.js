#!/usr/bin/env node

const MoniCron = require('../lib')
const config = require('../config')

const cron = new MoniCron(config)
cron.start()
