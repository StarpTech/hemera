'use strict'

const Hemera = require('./../../packages/hemera')
const nats = require('nats').connect()

const hemera = new Hemera(nats, {
  logLevel: 'debug'
})

hemera.ready(() => {
  hemera.act(
    {
      topic: 'math',
      cmd: 'add',
      a: 1,
      b: 2
    },
    function(err, resp) {
      if (err) {
        this.log.error(err)
        return
      }
      this.log.info(resp)
    }
  )
})
