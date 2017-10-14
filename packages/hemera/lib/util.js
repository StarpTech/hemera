'use strict'

/**
 * Copyright 2016-present, Dustin Deus (deusdustin@gmail.com)
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const lut = []
for (let i = 0; i < 256; i++) {
  lut[i] = (i < 16 ? '0' : '') + i.toString(16)
}

/**
 * @class Util
 */
class Util {
  /**
   *
   *
   * @static
   * @param {any} subject
   * @returns
   *
   * @memberof Util
   */
  static natsWildcardToRegex(subject) {
    let hasTokenWildcard = subject.indexOf('*') > -1
    let hasFullWildcard = subject.indexOf('>') > -1

    if (hasFullWildcard) {
      subject = subject.replace('>', '[a-zA-Z0-9\\-\\.]+')
      return new RegExp('^' + subject + '$', 'i')
    } else if (hasTokenWildcard) {
      subject = subject.replace('*', '[a-zA-Z0-9\\-]+')
      return new RegExp('^' + subject + '$', 'i')
    }

    return subject
  }

  /**
   * @static
   * @param {any} handler
   * @memberof Util
   */
  static wrapFuncAsPromise(handler) {
    if (Util.isAsyncFunction(handler)) {
      return function() {
        // -1 because (req, res, next)
        const next = arguments[arguments.length - 1]
        return handler
          .apply(null, arguments)
          .then(x => next(null, x))
          .catch(next)
      }
    } else {
      return handler
    }
  }
  /**
   * @returns
   * Fast ID generator: e7 https://jsperf.com/uuid-generator-opt/18
   * @memberOf Util
   */
  static randomId() {
    const d0 = (Math.random() * 0xffffffff) | 0
    const d1 = (Math.random() * 0xffffffff) | 0
    const d2 = (Math.random() * 0xffffffff) | 0
    const d3 = (Math.random() * 0xffffffff) | 0
    return (
      lut[d0 & 0xff] +
      lut[(d0 >> 8) & 0xff] +
      lut[(d0 >> 16) & 0xff] +
      lut[(d0 >> 24) & 0xff] +
      lut[d1 & 0xff] +
      lut[(d1 >> 8) & 0xff] +
      lut[((d1 >> 16) & 0x0f) | 0x40] +
      lut[(d1 >> 24) & 0xff] +
      lut[(d2 & 0x3f) | 0x80] +
      lut[(d2 >> 8) & 0xff] +
      lut[(d2 >> 16) & 0xff] +
      lut[(d2 >> 24) & 0xff] +
      lut[d3 & 0xff] +
      lut[(d3 >> 8) & 0xff] +
      lut[(d3 >> 16) & 0xff] +
      lut[(d3 >> 24) & 0xff]
    )
  }

  /**
   *
   *
   * @static
   * @param {any} array
   * @param {any} method
   * @param {any} callback
   *
   * @memberOf Util
   */
  static eachSeries(array, method, callback) {
    if (!array.length) {
      callback()
    } else {
      let i = 0
      const iterate = function() {
        const done = function(err) {
          if (err) {
            callback(err)
          } else {
            i = i + 1
            if (i < array.length) {
              iterate()
            } else {
              callback()
            }
          }
        }

        method(array[i], done, i)
      }

      iterate()
    }
  }
  /**
   * Get high resolution time in nanoseconds
   *
   * @static
   * @returns
   *
   * @memberOf Util
   */
  static nowHrTime() {
    const hrtime = process.hrtime()
    return +hrtime[0] * 1e9 + +hrtime[1]
  }
  /**
   *
   *
   * @static
   * @param {any} obj
   * @returns
   *
   * @memberOf Util
   */
  static extractSchema(obj) {
    if (obj === null) return obj

    const o = {}

    for (var key in obj) {
      if (typeof obj[key] === 'object') {
        o[key] = obj[key]
      }
    }

    return o
  }
  /**
   * @static
   * @param {any} obj
   * @returns
   *
   * @memberOf Util
   */
  static cleanPattern(obj) {
    if (obj === null) return obj

    const o = {}

    for (var key in obj) {
      if (
        !key.endsWith('$') &&
        (typeof obj[key] !== 'object' || obj[key] instanceof RegExp) &&
        typeof obj[key] !== 'function'
      ) {
        o[key] = obj[key]
      }
    }

    return o
  }

  /**
   * @static
   * @param {any} obj
   * @returns
   *
   * @memberOf Util
   */
  static cleanFromSpecialVars(obj) {
    if (obj === null) return obj

    const o = {}

    for (var key in obj) {
      if (!key.endsWith('$')) {
        o[key] = obj[key]
      }
    }
    return o
  }

  /**
   * @param {any} args
   * @returns
   *
   * @memberOf Util
   */
  static pattern(args) {
    if (typeof args === 'string') {
      return args
    }

    const obj = Util.cleanPattern(args)
    let sb = []

    for (var key in obj) {
      sb.push(key + ':' + obj[key])
    }

    sb.sort()

    return sb.join(',')
  }

  /*
   *
   *
   * @static
   * @param {any} obj
   * @returns
   * @memberof Util
   */
  static isAsyncFunction(obj) {
    var constructor = obj.constructor
    if (!constructor) {
      return false
    }
    if (
      constructor.name === 'AsyncFunction' ||
      constructor.displayName === 'AsyncFunction'
    ) {
      return true
    }
    return false
  }
}

module.exports = Util
