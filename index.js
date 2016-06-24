var MODE = {
  ALL: 1,
  RACE: 2,
  SOME: 3,
  ANY: 4
}

function Parallels () {
  if (!(this instanceof Parallels)) {
    return new Parallels()
  }
  this._mode = null
  this._finished = false
  this._result = []
  this._err = null
  this._count = 0
  this._total = 0
  this._callback = null
}

Parallels.prototype.push = function () {
  var self = this
  var curr = this._total
  this._total++
  this._result.push(undefined)

  return function (err, val) {
    if (self._result[curr] !== undefined) return // prevent repeated callback
    self._err = self._err || err
    self._result[curr] = val || null
    self._count++
    self._invoke()
  }
}

Parallels.prototype.all = function (cb) {
  this._callback = cb
  this._mode = MODE.ALL
  this._invoke()
}

Parallels.prototype._invoke = function () {
  // ignore if no callback given or finished
  if (!this._callback || this._finished) return

  if (this._mode === MODE.ALL) {
    // ALL mode
    if (this._err) {
      // any error results err callback
      this._finished = true
      this._callback(this._err)
    } else if (this._count === this._total) {
      this._finished = true
      // all results resolved
      this._callback(this._err, this._err ? null : this._result)
    }
  }
}

module.exports = Parallels
