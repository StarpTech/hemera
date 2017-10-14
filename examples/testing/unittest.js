'use strict'

/**
 * Run mocha ./examples/unittest.js
 */

const Hemera = require('./../../packages/hemera')
const Nats = require('hemera-testsuite/natsStub')
const ActStub = require('hemera-testsuite/actStub')
const AddStub = require('hemera-testsuite/addStub')
const Code = require('code')
const expect = Code.expect

const nats = new Nats()
const hemera = new Hemera(nats, {
  logLevel: 'info'
})
const actStub = new ActStub(hemera)

hemera.ready(function() {
  hemera.add(
    {
      topic: 'math',
      cmd: 'add'
    },
    function(args, cb) {
      this.act({ topic: 'math', cmd: 'sub', a: 100, b: 50 }, function(
        err,
        result
      ) {
        expect(err).to.be.not.exists()
        expect(result).to.be.equals(50)
        cb(err, args.a + args.b - result)
      })
    }
  )

  // stub act calls
  actStub.stub({ topic: 'math', cmd: 'sub', a: 100, b: 50 }, null, 50)
  actStub.stub({ topic: 'math', cmd: 'add' }, new Error('wrong arguments'))
  actStub.stub({ topic: 'math', cmd: 'add', a: 100, b: 200 }, null, 300)

  // Important run it when "add" was already added
  // Should execute the server method with the pattern topic:math,cmd:add,a:100,b:200"
  AddStub.run(
    hemera,
    { topic: 'math', cmd: 'add' },
    { a: 100, b: 200 },
    function(err, result) {
      expect(err).to.be.not.exists()
      expect(result).to.be.equals(250)
    }
  )

  hemera.act(
    {
      topic: 'math',
      cmd: 'add',
      a: 100,
      b: 200
    },
    function(err, result) {
      expect(err).to.be.not.exists()
      expect(result).to.be.equals(300)
    }
  )
})
