'use strict'

const chalk = require('chalk')

const defaultOpt = {
  deactivate: false,
  separator: ' - ',
  format: ['date', 'method', 'url', 'status', 'responseTime']
}

function loggerFactory(options) {
  const opt = Object.assign({}, defaultOpt, options)

  if (opt.deactivate) {
    return async (ctx, next) => next()
  }

  return async function logger(ctx, next) {

    const startTime = Date.now()
    await next()
    const endTime = Date.now()

    const statusColor = ctx.response.status >= 400 ? 'redBright' : 'greenBright'

    const fieldsAvailable = {
      date: chalk.gray(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()),
      host: chalk.blueBright(ctx.request.host),
      method: chalk.greenBright(ctx.request.method),
      url: chalk.blueBright(ctx.request.url),
      path: chalk.blueBright(ctx.request.path),
      responseTime : endTime - startTime + ' ms',
      status : chalk[statusColor](ctx.response.status),
      body: JSON.stringify(ctx.request.body),
    }

    const log = opt.format.reduce((log, field, index, array) => {
      log += fieldsAvailable[field]
      if (index + 1 !== array.length) {
        log += opt.separator
      }
      return log
    }, '')

    console.log(log)
  }
}

module.exports = loggerFactory
