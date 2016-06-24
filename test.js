var test = require('tape')
var parallels = require('./')

function cbRes (timeout, res, cb) {
  setTimeout(cb, timeout, null, res)
}
function cbErr (timeout, err, cb) {
  setTimeout(cb, timeout, err)
}

test('all', function (t) {
  t.plan(2)
  var next = parallels()
  cbRes(20, 1, next.push())
  cbRes(10, 2, next.push())
  cbRes(30, 3, next.push())
  cbRes(0, 4, next.push())
  next.all(function (err, res) {
    t.notOk(err, 'no error')
    t.deepEqual(res, [1, 2, 3, 4], 'callback all correct sequence')
  })
})
test('callback error', function (t) {
  t.plan(2)
  var next = parallels()
  cbRes(20, 1, next.push())
  cbErr(10, 2, next.push())
  cbRes(30, 3, next.push())
  cbErr(0, 4, next.push())
  next.all(function (err, res) {
    t.equal(4, err, 'only return first error callback')
    t.notOk(res, 'no result on error')
  })
})
test('repeated callback', function (t) {
  t.plan(2)
  var next = parallels()
  cbRes(20, 1, next.push())
  var cb = next.push()
  cbRes(10, 2, cb)
  cbRes(11, 'foo', cb)
  cbRes(12, 'bar', cb)
  cbRes(30, 3, next.push())
  cbRes(0, 4, next.push())
  next.all(function (err, res) {
    t.notOk(err, 'no error')
    t.deepEqual(res, [1, 2, 3, 4], 'callback all correct sequence')
  })
})
test('callback before done', function (t) {
  t.plan(2)
  var next = parallels()
  cbRes(20, 1, next.push())
  cbRes(10, 2, next.push())
  cbRes(30, 3, next.push())
  cbRes(0, 4, next.push())
  setTimeout(function () {
    next.all(function (err, res) {
      t.notOk(err, 'no error')
      t.deepEqual(res, [1, 2, 3, 4], 'callback all correct sequence')
    })
  }, 100)
})
test('no callback after done', function (t) {
  t.plan(2)
  var next = parallels()
  cbRes(20, 1, next.push())
  cbRes(10, 2, next.push())
  cbRes(30, 3, next.push())
  setTimeout(function () {
    cbRes(0, 4, next.push())
    next.all(function (err, res) {
      t.notOk(err, 'no error')
      t.deepEqual(res, [1, 2, 3, 4], 'callback all correct sequence')
    })
    setTimeout(function () {
      cbRes(20, 1, next.push())
      cbRes(10, 2, next.push())
      cbRes(30, 3, next.push())
      cbRes(0, 4, next.push())
    }, 100)
  }, 100)
})
