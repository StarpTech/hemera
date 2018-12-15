'use strict'

describe('Load policy for server component', function() {
  const PORT = 6242
  const authUrl = 'nats://localhost:' + PORT
  let server

  before(function(done) {
    server = HemeraTestsuite.start_server(PORT, done)
  })

  after(function() {
    server.kill()
  })

  it('Should throw an ProcessLoadError with (Server under heavy load) and return the error without crash the process', function(done) {
    const nats = require('nats').connect(authUrl)
    let respondedSpy = Sinon.spy()
    const hemera = new Hemera(nats, {
      logLevel: 'silent',
      load: {
        checkPolicy: true,
        process: {
          sampleInterval: 1
        },
        policy: {
          maxRssBytes: 5
        }
      }
    })

    var stub = Sinon.stub(hemera, 'fatal')

    stub.onCall(1)

    stub.returns(true)

    hemera.ready(() => {
      hemera.add(
        {
          topic: 'a',
          cmd: 'a'
        },
        function(resp, cb) {
          cb()
          respondedSpy()
        }
      )

      hemera.act(
        {
          topic: 'a',
          cmd: 'a'
        },
        (err, resp) => {
          expect(respondedSpy.called).to.be.equals(false)
          expect(err instanceof Hemera.errors.ProcessLoadError).to.be.equals(
            true
          )
          expect(err.heapUsed).to.be.exists()
          expect(err.rss).to.be.least(5)
          expect(err.heapUsed).to.be.exists()
          expect(err.message).to.be.equals('Server under heavy load (rss)')

          // wait for next cycle
          setTimeout(() => {
            expect(stub.called).to.be.equals(false)
            hemera.close(done)
          })
        }
      )
    })
  })
})
