'use strict'

describe('Tracing', function() {
  const PORT = 6242
  const authUrl = 'nats://localhost:' + PORT
  let server

  before(function(done) {
    server = HemeraTestsuite.start_server(PORT, done)
  })

  after(function() {
    server.kill()
  })

  it('Should set correct trace$ context', function(done) {
    /**
     * math:add-->math:sub
     *            math:add
     *            math:add-->
     *
     */

    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    hemera.ready(() => {
      let traceId = '' // Is unique in a request

      hemera.add(
        {
          topic: 'math',
          cmd: 'add'
        },
        function(resp, cb) {
          expect(this.trace$.traceId).to.be.string()
          expect(this.trace$.spanId).to.be.string()
          cb(null, resp.a + resp.b)
        }
      )

      hemera.add(
        {
          topic: 'math',
          cmd: 'sub'
        },
        function(resp, cb) {
          let r1 = this.trace$.spanId

          expect(this.trace$.traceId).to.be.string()
          expect(this.trace$.spanId).to.be.string()
          expect(this.trace$.parentSpanId).to.be.string()

          this.act({
            topic: 'math',
            cmd: 'add',
            a: 1,
            b: 2
          })

          setTimeout(() => {
            this.act(
              {
                topic: 'math',
                cmd: 'add',
                a: 1,
                b: 2
              },
              function(err, resp2) {
                let r2 = this.trace$.spanId

                expect(err).to.be.not.exists()
                expect(this.trace$.parentSpanId).to.be.equals(r1)
                expect(this.trace$.traceId).to.be.equals(traceId)
                expect(this.trace$.spanId).to.be.string()
                expect(this.trace$.timestamp).to.be.number()

                this.act(
                  {
                    topic: 'math',
                    cmd: 'add',
                    a: 10,
                    b: 2
                  },
                  function(err, resp2) {
                    expect(err).to.be.not.exists()
                    expect(this.trace$.parentSpanId).to.be.equals(r2)
                    expect(this.trace$.parentSpanId).to.be.string()
                    expect(this.trace$.traceId).to.be.equals(traceId)
                    expect(this.trace$.spanId).to.be.string()
                    expect(this.trace$.timestamp).to.be.number()

                    cb(null, resp.a - resp.b)
                  }
                )
              }
            )
          }, 200)
        }
      )

      hemera.act(
        {
          topic: 'math',
          cmd: 'add',
          a: 1,
          b: 2
        },
        function(err, resp) {
          expect(err).to.be.not.exists()

          let r1 = this.trace$.spanId

          expect(this.trace$.traceId).to.be.exists()
          expect(this.trace$.spanId).to.be.string()
          expect(this.trace$.timestamp).to.be.number()

          traceId = this.trace$.traceId

          this.act(
            {
              topic: 'math',
              cmd: 'sub',
              a: 1,
              b: resp
            },
            function(err, resp) {
              expect(err).to.be.not.exists()
              expect(this.trace$.parentSpanId).to.be.equals(r1)
              expect(this.trace$.traceId).to.be.equals(traceId)
              expect(this.trace$.spanId).to.be.string()
              expect(this.trace$.timestamp).to.be.number()

              hemera.close(done)
            }
          )
        }
      )
    })
  })

  it('Should be able to get correct tracing informations', function(done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    hemera.ready(() => {
      hemera.ext('onRequest', function(ctx, request, reply, next) {
        let meta = {
          service: ctx.trace$.service,
          name: ctx.trace$.method
        }

        let traceData = {
          traceId: ctx.trace$.traceId,
          parentSpanId: ctx.trace$.parentSpanId,
          spanId: ctx.trace$.spanId,
          sampled: 1
        }

        expect(meta.service).to.be.equals('math')
        expect(meta.name).to.be.equals('a:1,b:2,cmd:add,topic:math')

        expect(traceData.traceId).to.be.exist()
        expect(traceData.parentSpanId).to.be.not.exist()
        expect(traceData.spanId).to.be.exist()
        expect(traceData.sampled).to.be.exist()

        next()
      })

      hemera.ext('onSend', function(ctx, request, reply, next) {
        let meta = {
          service: ctx.trace$.service,
          name: ctx.trace$.method
        }

        expect(meta.service).to.be.equals('math')
        expect(meta.name).to.be.equals('a:1,b:2,cmd:add,topic:math')

        next()
      })

      hemera.ext('onAct', function(ctx, next) {
        let meta = {
          service: ctx.trace$.service,
          name: ctx.trace$.method
        }

        let traceData = {
          traceId: ctx.trace$.traceId,
          parentSpanId: ctx.trace$.parentSpanId,
          spanId: ctx.trace$.spanId,
          sampled: 1
        }

        expect(meta.service).to.be.equals('math')
        expect(meta.name).to.be.equals('a:1,b:2,cmd:add,topic:math')

        expect(traceData.traceId).to.be.exist()
        expect(traceData.parentSpanId).to.be.not.exist()
        expect(traceData.spanId).to.be.exist()
        expect(traceData.sampled).to.be.exist()

        next()
      })

      hemera.ext('onActFinished', function(ctx, next) {
        let meta = {
          service: ctx.trace$.service,
          name: ctx.trace$.method
        }

        expect(meta.service).to.be.equals('math')
        expect(meta.name).to.be.equals('a:1,b:2,cmd:add,topic:math')

        next()
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
          cmd: 'add',
          topic: 'math',
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

  it('Should be able to extract trace method from pattern', function(done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    hemera.ready(() => {
      hemera.add(
        {
          topic: 'TOPIC',
          cmd: 'CMD'
        },
        function(req, next) {
          next()
        }
      )
      hemera.act(
        {
          topic: 'TOPIC',
          cmd: 'CMD',
          a: {
            b: 1
          }
        },
        function(err, resp) {
          expect(err).to.be.not.exists()
          expect(this.trace$.method).to.be.equals('cmd:CMD,topic:TOPIC')
          hemera.close(done)
        }
      )
    })
  })

  it('Should be able to get duration from trace$', function(done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    hemera.ready(() => {
      hemera.add(
        {
          topic: 'TOPIC',
          cmd: 'CMD'
        },
        function(req, next) {
          next()
        }
      )
      hemera.act(
        {
          topic: 'TOPIC',
          cmd: 'CMD',
          a: {
            b: 1
          }
        },
        function(err, resp) {
          expect(err).to.be.not.exists()
          expect(this.trace$.duration).to.be.a.number()
          hemera.close(done)
        }
      )
    })
  })

  it('Should be able to pass requestId$ from pattern in multiple calls', function() {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    return hemera.ready().then(() => {
      hemera.add(
        {
          topic: 'TOPIC',
          cmd: 'CMD'
        },
        function(req, next) {
          next()
        }
      )
      const a = hemera
        .act({
          topic: 'TOPIC',
          cmd: 'CMD',
          requestId$: '123456789'
        })
        .then(function(hemera) {
          expect(hemera.context.request$.id).to.be.equals('123456789')
        })
      const b = hemera
        .act({
          topic: 'TOPIC',
          cmd: 'CMD',
          requestId$: '123456'
        })
        .then(function(hemera) {
          expect(hemera.context.request$.id).to.be.equals('123456')
        })

      return Promise.all([a, b]).then(x => hemera.close())
    })
  })

  it('Should be able to overwrite trace$ informations with pattern', function(done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    hemera.ready(() => {
      hemera.ext('onAct', (hemera, next) => {
        expect(hemera.trace$.spanId).to.be.equals(1)
        expect(hemera.trace$.traceId).to.be.equals(2)
        expect(hemera.trace$.parentSpanId).to.be.equals(22)
        next()
      })
      hemera.add(
        {
          topic: 'TOPIC',
          cmd: 'CMD'
        },
        function(req, next) {
          next()
        }
      )
      hemera.act(
        {
          topic: 'TOPIC',
          cmd: 'CMD',
          trace$: {
            parentSpanId: 22,
            spanId: 1,
            traceId: 2
          }
        },
        function(err, resp) {
          expect(err).to.be.not.exists()
          expect(this.trace$.parentSpanId).to.be.equals(22)
          expect(this.trace$.method).to.be.equals('cmd:CMD,topic:TOPIC')
          hemera.close(done)
        }
      )
    })
  })

  it('Should get correct parentSpanId information', function(done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    hemera.ready(() => {
      hemera.add(
        {
          topic: 'TOPIC',
          cmd: 'CMD'
        },
        function(req, next) {
          next()
        }
      )
      hemera.act(
        {
          topic: 'TOPIC',
          cmd: 'CMD'
        },
        function(err, resp) {
          expect(err).to.be.not.exists()
          const parent = this.trace$
          this.act(
            {
              topic: 'TOPIC',
              cmd: 'CMD'
            },
            function(err, resp) {
              expect(err).to.be.not.exists()
              expect(this.trace$.parentSpanId).to.be.equals(parent.spanId)
              hemera.close(done)
            }
          )
        }
      )
    })
  })

  it('Should get correct tracing information inside add', function(done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    hemera.ready(() => {
      hemera.add(
        {
          topic: 'TOPIC',
          cmd: 'CMD2'
        },
        function(req, next) {
          const parentTrace = this.trace$
          expect(parentTrace.service).to.be.equals('TOPIC')
          expect(parentTrace.method).to.be.equals('cmd:CMD2,topic:TOPIC')
          this.act(
            {
              topic: 'TOPIC',
              cmd: 'CMD'
            },
            function(err, resp) {
              expect(err).to.be.not.exists()
              expect(this.trace$.service).to.be.equals('TOPIC')
              expect(this.trace$.method).to.be.equals('cmd:CMD,topic:TOPIC')
              expect(this.trace$.spanId).to.be.equals(parentTrace.spanId)
              expect(this.trace$.traceId).to.be.equals(parentTrace.traceId)
              expect(this.trace$.parentSpanId).to.be.equals(parentTrace.spanId)
              next(null, this.trace$)
            }
          )
        }
      )
      hemera.add(
        {
          topic: 'TOPIC',
          cmd: 'CMD'
        },
        function(req, next) {
          next()
        }
      )
      hemera.act(
        {
          topic: 'TOPIC',
          cmd: 'CMD2'
        },
        function(err, resp) {
          expect(err).to.be.not.exists()
          expect(this.trace$.service).to.be.equals('TOPIC')
          expect(this.trace$.method).to.be.equals('cmd:CMD2,topic:TOPIC')
          expect(this.trace$.spanId).to.be.equals(resp.spanId)
          expect(this.trace$.traceId).to.be.equals(resp.traceId)
          expect(this.trace$.parentSpanId).to.not.exists()
          expect(this.trace$.duration).to.be.a.number()
          hemera.close(done)
        }
      )
    })
  })
})
