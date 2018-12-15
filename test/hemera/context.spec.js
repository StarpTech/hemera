'use strict'

describe('Context', function() {
  const PORT = 6242
  const authUrl = 'nats://localhost:' + PORT
  let server

  before(function(done) {
    server = HemeraTestsuite.start_server(PORT, done)
  })

  after(function() {
    server.kill()
  })

  it('Should be able to create a context', function(done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    hemera.ready(() => {
      hemera.add(
        {
          topic: 'math',
          cmd: 'add'
        },
        function(resp, cb) {
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
          b: 2,
          context$: 'test'
        },
        function(err, resp) {
          expect(this.context$).to.be.equals('test')
          expect(err).to.be.not.exists()
          expect(resp).not.to.be.equals(3)

          this.act(
            {
              topic: 'math',
              cmd: 'add',
              a: 1,
              b: 2
            },
            function(err, resp) {
              expect(this.context$).to.be.equals('test')
              expect(err).to.be.not.exists()
              expect(resp).not.to.be.equals(3)
              hemera.close(done)
            }
          )
        }
      )
    })
  })
})
