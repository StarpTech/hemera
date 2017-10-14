'use strict'

const HemeraSnappy = require('../../packages/hemera-snappy')

describe('Hemera-snappy', function() {
  const PORT = 6243
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

  it('encode and decode', function(done) {
    const nats = require('nats').connect({
      url: authUrl,
      preserveBuffers: true
    })

    const hemera = new Hemera(nats)

    hemera.use(HemeraSnappy)

    hemera.ready(() => {
      hemera.add(
        {
          topic: 'math',
          cmd: 'add'
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
        (err, resp) => {
          expect(err).to.be.not.exists()
          expect(resp).to.be.equals(3)
          hemera.close(done)
        }
      )
    })
  })

  it('encode and decode complex type', function(done) {
    const nats = require('nats').connect({
      url: authUrl,
      preserveBuffers: true
    })

    const hemera = new Hemera(nats)

    hemera.use(HemeraSnappy)

    hemera.ready(() => {
      hemera.add(
        {
          topic: 'math',
          cmd: 'add'
        },
        (resp, cb) => {
          cb(null, {
            result: resp.a + resp.b
          })
        }
      )

      hemera.act(
        {
          topic: 'math',
          cmd: 'add',
          a: 1,
          b: 2
        },
        (err, resp) => {
          expect(err).to.be.not.exists()
          expect(resp.result).to.be.equals(3)
          hemera.close(done)
        }
      )
    })
  })
})
