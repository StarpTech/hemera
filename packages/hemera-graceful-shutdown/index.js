'use strict'

const Hp = require('hemera-plugin')
const GracefulShutdown = require('./gracefulShutdown')

exports.plugin = Hp(hemeraGracefulShutdown, '>=2.0.0')
exports.options = {
  name: require('./package.json').name
}

function hemeraGracefulShutdown(hemera, opts, done) {
  const gs = new GracefulShutdown()
  gs.process = process
  gs.logger = hemera.log
  gs.addHandler((signal, cb) => {
    hemera.log.info({ signal: signal }, 'triggering close hook')
    hemera.close(cb)
  })
  gs.init()
  hemera.decorate('gracefulShutdown', handler => gs.addHandler(handler))
  done()
}
