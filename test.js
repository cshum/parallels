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
  var p = parallels()
  cbRes(20, 1, p.push())
  cbRes(10, 2, p.push())
  cbRes(30, 3, p.push())
  cbRes(0, 4, p.push())
  p.all(function (err, res) {
    t.notOk(err, 'no error')
    t.deepEqual(res, [1, 2, 3, 4], 'callback all correct sequence')
  })
})
test('all & error', function (t) {
  t.plan(2)
  var p = parallels()
  cbRes(20, 1, p.push())
  cbErr(10, 2, p.push())
  cbRes(30, 3, p.push())
  cbErr(0, 4, p.push())
  p.all(function (err, res) {
    t.equal(4, err, 'only return first error callback')
    t.notOk(res, 'no result on error')
  })
})
test('race', function (t) {
  t.plan(2)
  var p = parallels()
  cbRes(20, 1, p.push())
  cbRes(10, 2, p.push())
  cbRes(30, 3, p.push())
  cbRes(0, 4, p.push())
  p.race(function (err, res) {
    t.notOk(err, 'no error')
    t.deepEqual(res, 4, 'callback race correct value')
  })
})
test('race & error', function (t) {
  t.plan(2)
  var p = parallels()
  cbRes(20, 1, p.push())
  cbErr(10, 2, p.push())
  cbRes(30, 3, p.push())
  cbErr(0, 4, p.push())
  p.all(function (err, res) {
    t.equal(4, err, 'only return first error callback')
    t.notOk(res, 'no result on error')
  })
})
test('some', function (t) {
  t.plan(2)
  var p = parallels()
  cbRes(20, 1, p.push())
  cbRes(10, 2, p.push())
  cbRes(30, 3, p.push())
  cbRes(0, 4, p.push())
  p.some(2, function (err, res) {
    t.notOk(err, 'no error')
    t.deepEqual(res, [4, 2], 'callback some correct values')
  })
})
test('some & error ok', function (t) {
  t.plan(2)
  var p = parallels()
  cbRes(20, 1, p.push())
  cbErr(10, 2, p.push())
  cbRes(30, 3, p.push())
  cbErr(0, 4, p.push())
  p.some(2, function (err, res) {
    t.notOk(err, 'no error')
    t.deepEqual(res, [1, 3], 'callback some correct values')
  })
})
test('some & error not ok', function (t) {
  t.plan(2)
  var p = parallels()
  cbRes(20, 1, p.push())
  cbErr(10, 2, p.push())
  cbRes(30, 3, p.push())
  cbErr(0, 4, p.push())
  p.some(3, function (err, res) {
    t.equal(4, err, 'only return first error callback')
    t.notOk(res, 'no result on error')
  })
})
test('any', function (t) {
  t.plan(2)
  var p = parallels()
  cbRes(20, 1, p.push())
  cbRes(10, 2, p.push())
  cbRes(30, 3, p.push())
  cbRes(0, 4, p.push())
  p.any(function (err, res) {
    t.notOk(err, 'no error')
    t.deepEqual(res, 4, 'callback any correct value')
  })
})
test('any & error ok', function (t) {
  t.plan(2)
  var p = parallels()
  cbRes(20, 1, p.push())
  cbErr(10, 2, p.push())
  cbRes(30, 3, p.push())
  cbErr(0, 4, p.push())
  p.any(function (err, res) {
    t.notOk(err, 'no error')
    t.deepEqual(res, 1, 'callback any correct values')
  })
})
test('any & error not ok', function (t) {
  t.plan(2)
  var p = parallels()
  cbErr(10, 2, p.push())
  cbErr(0, 4, p.push())
  p.any(function (err, res) {
    t.equal(4, err, 'only return first error callback')
    t.notOk(res, 'no result on error')
  })
})
test('repeated callback', function (t) {
  t.plan(2)
  var p = parallels()
  cbRes(20, 1, p.push())
  var cb = p.push()
  cbRes(10, 2, cb)
  cbRes(11, 'foo', cb)
  cbRes(12, 'bar', cb)
  cbRes(30, 3, p.push())
  cbRes(0, 4, p.push())
  p.all(function (err, res) {
    t.notOk(err, 'no error')
    t.deepEqual(res, [1, 2, 3, 4], 'callback all correct sequence')
  })
})
test('callback before done', function (t) {
  t.plan(2)
  var p = parallels()
  cbRes(20, 1, p.push())
  cbRes(10, 2, p.push())
  cbRes(30, 3, p.push())
  cbRes(0, 4, p.push())
  setTimeout(function () {
    p.all(function (err, res) {
      t.notOk(err, 'no error')
      t.deepEqual(res, [1, 2, 3, 4], 'callback all correct sequence')
    })
  }, 100)
})
test('no callback after done', function (t) {
  t.plan(2)
  var p = parallels()
  cbRes(20, 1, p.push())
  cbRes(10, 2, p.push())
  cbRes(30, 3, p.push())
  setTimeout(function () {
    cbRes(0, 4, p.push())
    p.all(function (err, res) {
      t.notOk(err, 'no error')
      t.deepEqual(res, [1, 2, 3, 4], 'callback all correct sequence')
    })
    setTimeout(function () {
      cbRes(20, 1, p.push())
      cbRes(10, 2, p.push())
      cbRes(30, 3, p.push())
      cbRes(0, 4, p.push())
    }, 100)
  }, 100)
})
