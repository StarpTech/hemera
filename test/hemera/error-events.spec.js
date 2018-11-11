'use strict'

describe('Response error events', function() {
  var PORT = 6242
  var authUrl = 'nats://localhost:' + PORT
  var server

  // Start up our own nats-server
  before(function(done) {
    server = HemeraTestsuite.start_server(PORT, done)
  })

  // Shutdown our server after we are done
  after(function() {
    server.kill()
  })

  it('onServerPreResponse extension error', function(done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)
    const spy = Sinon.spy()

    hemera.ready(() => {
      hemera.on('serverResponseError', function(err) {
        expect(err).to.be.exists()
        expect(err.name).to.be.equals('Error')
        expect(err.message).to.be.equals('test')
        spy()
      })

      hemera.ext('onServerPreResponse', function(ctx, resp, reply, next) {
        next(new Error('test'))
      })

      hemera.add(
        {
          cmd: 'add',
          topic: 'math'
        },
        (resp, cb) => {
          cb(null, resp.a + resp.b)
        }
      )

      hemera.act(
        {
          topic: 'math',
          cmd: 'add',
          a: 1,
          b: 2
        },
        err => {
          expect(err).to.be.exists()
          expect(spy.calledOnce).to.be.equals(true)
          hemera.close(done)
        }
      )
    })
  })

  it('onServerPreResponse extension error', function(done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)
    const spy = Sinon.spy()

    hemera.ready(() => {
      hemera.on('serverResponseError', function(err) {
        expect(err).to.be.exists()
        expect(err.name).to.be.equals('Error')
        expect(err.message).to.be.equals('test')
        spy()
      })

      hemera.ext('onServerPreResponse', function(ctx, resp, req, next) {
        next(new Error('test'))
      })

      hemera.add(
        {
          cmd: 'add',
          topic: 'math'
        },
        (resp, cb) => {
          cb(null, resp.a + resp.b)
        }
      )

      hemera.act(
        {
          topic: 'math',
          cmd: 'add',
          a: 1,
          b: 2
        },
        err => {
          expect(err).to.be.exists()
          expect(err.name).to.be.equals('Error')
          expect(err.message).to.be.equals('test')
          expect(spy.callCount).to.be.equals(1)
          hemera.close(done)
        }
      )
    })
  })

  it('onServerPreHandler extension error', function(done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)
    const spy = Sinon.spy()

    hemera.ready(() => {
      hemera.on('serverResponseError', function(err) {
        expect(err).to.be.exists()
        expect(err.name).to.be.equals('Error')
        expect(err.message).to.be.equals('test')
        spy()
      })

      hemera.ext('onServerPreHandler', function(ctx, resp, req, next) {
        next(new Error('test'))
      })

      hemera.add(
        {
          cmd: 'add',
          topic: 'math'
        },
        (resp, cb) => {
          cb(null, resp.a + resp.b)
        }
      )

      hemera.act(
        {
          topic: 'math',
          cmd: 'add',
          a: 1,
          b: 2
        },
        err => {
          expect(err).to.be.exists()
          expect(err.name).to.be.equals('Error')
          expect(err.message).to.be.equals('test')
          expect(spy.calledOnce).to.be.equals(true)
          hemera.close(done)
        }
      )
    })
  })

  it('onClientPostRequest extension error', function(done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)
    const spy = Sinon.spy()

    hemera.ready(() => {
      hemera.on('clientResponseError', function(err) {
        expect(err).to.be.exists()
        expect(err.name).to.be.equals('Error')
        expect(err.message).to.be.equals('test')
        spy()
      })

      hemera.ext('onClientPostRequest', function(ctx, next) {
        next(new Error('test'))
      })

      hemera.add(
        {
          cmd: 'add',
          topic: 'math'
        },
        (resp, cb) => {
          cb(null, resp.a + resp.b)
        }
      )

      hemera.act(
        {
          topic: 'math',
          cmd: 'add',
          a: 1,
          b: 2
        },
        err => {
          expect(err).to.be.exists()
          expect(err.name).to.be.equals('Error')
          expect(err.message).to.be.equals('test')
          expect(spy.calledOnce).to.be.equals(true)
          hemera.close(done)
        }
      )
    })
  })

  it('onClientPreRequest extension error', function(done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)
    const spy = Sinon.spy()

    hemera.ready(() => {
      hemera.on('clientResponseError', function(err) {
        expect(err).to.be.exists()
        expect(err.name).to.be.equals('Error')
        expect(err.message).to.be.equals('test')
        spy()
      })

      hemera.ext('onClientPreRequest', function(ctx, next) {
        next(new Error('test'))
      })

      hemera.add(
        {
          cmd: 'add',
          topic: 'math'
        },
        (resp, cb) => {
          cb(null, resp.a + resp.b)
        }
      )

      hemera.act(
        {
          topic: 'math',
          cmd: 'add',
          a: 1,
          b: 2
        },
        err => {
          expect(err).to.be.exists()
          expect(err.name).to.be.equals('Error')
          expect(err.message).to.be.equals('test')
          expect(spy.calledOnce).to.be.equals(true)
          hemera.close(done)
        }
      )
    })
  })
})
