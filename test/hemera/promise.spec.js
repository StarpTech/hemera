describe('Promise', function() {
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

  it('Should be able to return a promise with ready', function() {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    return hemera.ready().then(() => {
      hemera.add(
        {
          topic: 'math',
          cmd: 'add'
        },
        resp => {
          return Promise.resolve(resp.a + resp.b)
        }
      )

      return hemera
        .act({
          topic: 'math',
          cmd: 'add',
          a: 1,
          b: 2
        })
        .then(out => {
          expect(out.data).to.be.equals(3)
          return hemera.close()
        })
    })
  })

  it('Should be able to catch bootstrapping errors with ready', function() {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    hemera.after((err, cb) => {
      expect(err).to.be.not.exists()
      cb(new Error('test'))
    })

    return hemera.ready().catch(err => {
      expect(err.name).to.be.equals('Error')
      expect(err.message).to.be.equals('test')
    })
  })

  it('Should be able to return a promise in add', function() {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    return hemera.ready().then(() => {
      hemera.add(
        {
          topic: 'math',
          cmd: 'add'
        },
        resp => {
          return Promise.resolve(resp.a + resp.b)
        }
      )

      return hemera
        .act({
          topic: 'math',
          cmd: 'add',
          a: 1,
          b: 2
        })
        .then(out => {
          expect(out.data).to.be.equals(3)
          return hemera.close()
        })
    })
  })

  it('Should handle any rejected promise as error in add', function(done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    hemera.ready(() => {
      hemera.add(
        {
          topic: 'email',
          cmd: 'send'
        },
        resp => Promise.reject(new Error('test'))
      )

      hemera.act(
        {
          topic: 'email',
          cmd: 'send',
          email: 'foobar@gmail.com',
          msg: 'Hi!'
        },
        (err, resp) => {
          expect(err).to.be.exists()
          hemera.close(done)
        }
      )
    })
  })

  it('Should be able to support zero as a server response', function(done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    hemera.ready(() => {
      hemera.add(
        {
          topic: 'math',
          cmd: 'multiply'
        },
        (req, cb) => {
          cb(null, req.a * req.b)
        }
      )
      hemera.act(
        {
          topic: 'math',
          cmd: 'multiply',
          a: 0,
          b: 0
        },
        function(err, resp) {
          expect(err).to.be.not.exists()
          expect(resp).to.be.equals(0)
          hemera.close(done)
        }
      )
    })
  })

  it('Should return fullfilled promise when calling close without callback', function() {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    return hemera.ready().then(() => {
      hemera.add(
        {
          topic: 'math',
          cmd: 'add'
        },
        resp => {
          return Promise.resolve(resp.a + resp.b)
        }
      )

      return hemera.close()
    })
  })

  it('Should handle any fulfilled promise as value in add', function(done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    hemera.ready(() => {
      hemera.add(
        {
          topic: 'email',
          cmd: 'send'
        },
        resp => Promise.resolve(100)
      )

      hemera.act(
        {
          topic: 'email',
          cmd: 'send',
          email: 'foobar@gmail.com',
          msg: 'Hi!'
        },
        (err, resp) => {
          expect(err).to.be.not.exists()
          expect(resp).to.be.equals(100)
          hemera.close(done)
        }
      )
    })
  })

  it('Should handle any rejected promise as error in add', function(done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    hemera.ready(() => {
      hemera.add(
        {
          topic: 'email',
          cmd: 'send'
        },
        resp => Promise.reject(new Error('test'))
      )

      hemera.act(
        {
          topic: 'email',
          cmd: 'send',
          email: 'foobar@gmail.com',
          msg: 'Hi!'
        },
        (err, resp) => {
          expect(err).to.be.exists()
          hemera.close(done)
        }
      )
    })
  })

  it('Should return rejected promise when calling close ext passed an error', function() {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    hemera.ext('onClose', function(ctx, next) {
      next(new Error('test'))
    })

    return hemera.ready().then(() => {
      hemera.add(
        {
          topic: 'math',
          cmd: 'add'
        },
        resp => {
          return Promise.resolve(resp.a + resp.b)
        }
      )

      return hemera.close().catch(err => {
        expect(err).to.be.exists()
      })
    })
  })

  it('Should call add handler only once', function() {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)
    const spy = Sinon.spy()

    return hemera.ready().then(() => {
      hemera.add(
        {
          topic: 'math',
          cmd: 'add'
        },
        resp => {
          spy()
          return Promise.resolve(resp.a + resp.b)
        }
      )

      return hemera
        .act({
          topic: 'math',
          cmd: 'add',
          a: 1,
          b: 2
        })
        .then(out => {
          expect(out.data).to.be.equals(3)
          expect(spy.calledOnce).to.be.equals(true)
          return hemera.close()
        })
    })
  })

  it('Should be able to reject a promise in add', function() {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    return hemera.ready().then(() => {
      hemera.add(
        {
          topic: 'math',
          cmd: 'add'
        },
        resp => {
          return Promise.reject(new Error('test'))
        }
      )

      return hemera
        .act({
          topic: 'math',
          cmd: 'add',
          a: 1,
          b: 2
        })
        .catch(err => {
          expect(err).to.be.exists()
          return hemera.close()
        })
    })
  })
})
