// @flow

/*!
 * hemera
 * Copyright(c) 2016 Dustin Deus (deusdustin@gmail.com)
 * MIT Licensed
 */

import _ from 'lodash'
import Crypto from 'crypto'

/**
 * @class Util
 */
class Util {

	/**
	 * @returns
	 *
	 * @memberOf Util
	 */
	static randomId() {

		return Crypto.randomBytes(16).toString('hex')
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
		return Math.floor(hrtime[0] * 1000000 + hrtime[1] / 1000)
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

		return _.pickBy(obj, function (val, prop: string) {
			return !_.includes(prop, '$')
		})
	}

	/**
	 * @param {any} args
	 * @returns
	 *
	 * @memberOf Util
	 */
	static pattern(args) {

		if (_.isString(args)) {
			return args
		}

		args = args || {}
		let sb = []
		_.each(args, function (v, k) {
			if (!~k.indexOf('$') && !_.isFunction(v)) {
				sb.push(k + ':' + v)
			}
		})

		sb.sort()

		return sb.join(',')
	}

	/**
	 * @param {Array} iterations
	 * @param {Function} func
	 * @param {Function} callback
	 * @returns
	 *
	 * @memberOf Util
	 */
	static asyncLoop(iterations: Array, func: Function, callback: Function) {
		var length = iterations.length;
		var index = 0;
		var done = false;
		var loop = {
			next() {
				if (done) { return; }

				if (index < length) {
					func(loop, iterations[index++], index);
				} else {
					done = true;
					callback();
				}
			},

			break: function () {
				done = true;
				if (callback) callback();
			}
		};

		loop.next();
		return loop;
	}
}

module.exports = Util
