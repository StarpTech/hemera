'use strict'

global.Hemera = require('../../packages/hemera')
global.HemeraConstants = require('../../packages/hemera/lib/constants')
global.HemeraSymbols = require('../../packages/hemera/lib/symbols')
global.HemeraUtil = require('../../packages/hemera/lib/util')
global.Code = require('code')
global.Sinon = require('sinon')
global.HemeraTestsuite = require('hemera-testsuite')
global.expect = global.Code.expect
global.UnauthorizedError = Hemera.createError('Unauthorized')

process.setMaxListeners(0)
