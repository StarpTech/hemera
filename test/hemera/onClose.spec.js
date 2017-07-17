'use strict'

describe('onClose extension', function () {
  var PORT = 6242
  var flags = ['--user', 'derek', '--pass', 'foobar']
  var authUrl = 'nats://derek:foobar@localhost:' + PORT
  var server

  // Start up our own nats-server
  before(function (done) {
    server = HemeraTestsuite.start_server(PORT, flags, done)
  })

  // Shutdown our server after we are done
  after(function () {
    server.kill()
  })

  it('Should be able to add onClose extension handler', function (done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)
    let firstOnCloseHandler = Sinon.spy()
    let secondOnCloseHandler = Sinon.spy()

    hemera.ext('onClose', function (next) {
      firstOnCloseHandler()
      next()
    })

    // Plugin
    let plugin = function (options) {
      let hemera = this

      hemera.ext('onClose', function (next) {
        secondOnCloseHandler()
        next()
      })
    }

    hemera.use({
      plugin: plugin,
      attributes: {
        name: 'myPlugin'
      },
      options: {}
    })

    hemera.ready(() => {
      hemera.close()
      expect(secondOnCloseHandler.callCount).to.be.equals(1)
      expect(firstOnCloseHandler.callCount).to.be.equals(1)
      done()
    })
  })

  it('Should be able to pass an error to onClose extension handler', function (done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)
    let firstOnCloseHandler = Sinon.spy()
    let secondOnCloseHandler = Sinon.spy()

    hemera.ext('onClose', function (next) {
      firstOnCloseHandler()
      next()
    })

    // Plugin
    let plugin = function (options) {
      let hemera = this

      hemera.ext('onClose', function (next) {
        secondOnCloseHandler()
        next(new Error('test'))
      })
    }

    hemera.use({
      plugin: plugin,
      attributes: {
        name: 'myPlugin'
      },
      options: {}
    })

    hemera.on('error', (err) => {
      expect(err.message).to.be.equals('test')
      done()
    })

    hemera.ready(x => {
      hemera.close()
      expect(secondOnCloseHandler.callCount).to.be.equals(1)
      expect(firstOnCloseHandler.callCount).to.be.equals(1)
    })
  })

  it('Should be able to add onClose extension handler with generators', function (done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)
    let firstOnCloseHandler = Sinon.spy()
    let secondOnCloseHandler = Sinon.spy()

    hemera.ext('onClose', function * (done) {
      firstOnCloseHandler()
      return yield Promise.resolve()
    })

    // Plugin
    let plugin = function (options) {
      let hemera = this

      hemera.ext('onClose', function * () {
        secondOnCloseHandler()
        return yield Promise.resolve()
      })
    }

    hemera.use({
      plugin: plugin,
      attributes: {
        name: 'myPlugin'
      },
      options: {}
    })

    hemera.ready(() => {
      hemera.close()
      setTimeout(() => {
        expect(secondOnCloseHandler.callCount).to.be.equals(1)
        expect(firstOnCloseHandler.callCount).to.be.equals(1)
        done()
      })
    })
  })

  it('Should be able to pass an error to onClose extension handler with generators', function (done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)
    let firstOnCloseHandler = Sinon.spy()
    let secondOnCloseHandler = Sinon.spy()

    hemera.ext('onClose', function * () {
      firstOnCloseHandler()
      return yield Promise.resolve()
    })

    // Plugin
    let plugin = function (options) {
      let hemera = this

      hemera.ext('onClose', function * () {
        secondOnCloseHandler()
        return yield Promise.reject(new Error('test'))
      })
    }

    hemera.use({
      plugin: plugin,
      attributes: {
        name: 'myPlugin'
      },
      options: {}
    })

    hemera.on('error', (err) => {
      expect(err.message).to.be.equals('test')
      setTimeout(() => {
        expect(secondOnCloseHandler.callCount).to.be.equals(1)
        expect(firstOnCloseHandler.callCount).to.be.equals(1)
        done()
      })
    })

    hemera.ready(x => {
      hemera.close()
    })
  })
})
