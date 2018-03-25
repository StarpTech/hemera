'use strict'

const Hemera = require('./../../packages/hemera')
const nats = require('nats').connect()

const hemera = new Hemera(nats, {
  logLevel: 'info'
})

const start = async () => {
  try {
    await hemera.ready()
    hemera.add(
      {
        topic: 'math',
        cmd: 'add'
      },
      async function(req) {
        return req.a + req.b
      }
    )
    hemera.log.info(`service listening`)
    // start request
    let out = await hemera.act({
      topic: 'math',
      cmd: 'add',
      a: 10,
      b: 10
    })
    hemera.log.info(`result 1`, out.data)
    out = await out.context.act({
      topic: 'math',
      cmd: 'add',
      a: 10,
      b: 30
    })
    hemera.log.info(`result 2`, out.data)
  } catch (err) {
    hemera.log.error(err)
    process.exit(1)
  }
}
start()
