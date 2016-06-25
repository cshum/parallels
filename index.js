var MODE = {
  ALL: 1,
  RACE: 2,
  SOME: 3,
  ANY: 4
}
var noop = function () {}

function Parallels () {
  if (!(this instanceof Parallels)) {
    return new Parallels()
  }
  this._mode = null
  this._ended = false
  this._result = []
  this._resolved = []
  this._invoked = []
  this._err = null
  this._count = 0
  this._total = 0
  this._some = 1
  this._callback = null
}

/**
 * Returns callback function to be invoked,
 * which pushes values to result list
 *
 * @returns {function} callback function
 */
Parallels.prototype.push = function () {
  if (this._ended) return noop

  var self = this
  var curr = this._total
  this._total++
  this._result.push(null)
  this._invoked.push(false)

  return function (err, val) {
    if (self._ended || self._invoked[curr]) return // prevent repeated callback
    if (!err) self._resolved.push(val)
    self._err = self._err || err
    self._result[curr] = val
    self._invoked[curr] = true
    self._count++
    self._invoke()
  }
}

/**
 * Done when all callbacks resolved or any error
 * returning result list in sequence or error
 *
 * @param {function} done - callback function
 */
Parallels.prototype.all = function (done) {
  this._callback = done
  this._mode = MODE.ALL
  this._invoke()
}

/**
 * Done returning result or error
 * as soon as any callback invoked
 *
 * @param {function} done - callback function
 */
Parallels.prototype.race = function (done) {
  this._callback = done
  this._mode = MODE.RACE
  this._invoke()
}

/**
 * Done returning result list or error
 * as soon as number of callbacks resolved reach count
 *
 * @param {number} count - number to be resolved
 * @param {function} done - callback function
 */
Parallels.prototype.some = function (count, done) {
  this._callback = done
  this._some = count || this._total
  this._mode = MODE.SOME
  this._invoke()
}

/**
 * Done returning result or error
 * as soon as any callback resolved
 *
 * @param {function} done - callback function
 */
Parallels.prototype.any = function (done) {
  this._callback = done
  this._mode = MODE.ANY
  this._invoke()
}

Parallels.prototype._invoke = function () {
  // ignore if no callback given or finished
  if (!this._callback || this._ended) return

  if (this._mode === MODE.ALL) {
    if (this._err) {
      this._ended = true
      this._callback(this._err)
    } else if (this._count === this._total) {
      this._ended = true
      this._callback(null, this._result)
    }
  } else if (this._mode === MODE.RACE) {
    if (this._err) {
      this._ended = true
      this._callback(this._err)
    } else if (this._count > 0) {
      this._ended = true
      this._callback(null, this._resolved[0])
    }
  } else if (this._mode === MODE.ANY) {
    if (this._resolved.length > 0) {
      this._ended = true
      this._callback(null, this._resolved[0])
    } else if (this._err && this._count === this._total) {
      this._ended = true
      this._callback(this._err)
    }
  } else if (this._mode === MODE.SOME) {
    if (this._resolved.length >= this._some) {
      this._ended = true
      this._callback(null, this._resolved)
    } else if (this._err && this._count === this._total) {
      this._ended = true
      this._callback(this._err)
    }
  }

  // clean up
  if (this._ended) {
    delete this._result
    delete this._resolved
    delete this._invoked
    delete this._err
    delete this._count
    delete this._total
    delete this._some
  }
}

module.exports = Parallels
