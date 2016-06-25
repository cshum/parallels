# parallels

Utilities for handling parallel callbacks.

[![Build Status](https://travis-ci.org/cshum/parallels.svg?branch=master)](https://travis-ci.org/cshum/parallels)

```bash
npm install parallels
```

#### `var p = parallels()`

Create a parallel instance.

#### `var cb = p.push()`

Returns a callback handling function that aggregates result in sequence.

#### `p.all(done)`

Aggregates callback values into an array. Returns error if error occurred in any of callbacks.

```js
var parallels = require('parallels')

function asyncFn (timeout, val, cb) {
  setTimeout(cb, timeout, null, val)
}
function asyncFnErr (timeout, err, cb) {
  setTimeout(cb, timeout, err)
}

var p = parallels()
asyncFn(20, 1, p.push())
asyncFn(10, 2, p.push())
asyncFn(30, 3, p.push())
p.all(function (err, val) {
  console.log(val) // [1, 2, 3]
})

var p2 = parallels()
asyncFn(5, 1, p2.push())
asyncFnErr(20, new Error('boom'), p2.push())
asyncFn(10, 3, p2.push())
p2.all(function (err, val) {
  console.log(err.message) // 'boom'
})
```
#### `p.any(done)`

Callback when any value resolved. Returns error if all not fulfilled.

```js
var p = parallels()
asyncFn(20, 1, p.push())
asyncFn(10, 2, p.push())
asyncFnErr(10, new Error('boom'), p.push())
p.any(function (err, val) {
  console.log(val) // 2
})

var p2 = parallels()
asyncFnErr(20, new Error('abcd'), p2.push())
asyncFnErr(10, new Error('boom'), p2.push())
p2.any(function (err, val) {
  console.log(err.message) // 'boom'
})
```

#### `p.some(count, done)`

Aggregates callback values by the number of `count` resolved. Returns error if not fulfilled by `count`.

```js
var p = parallels()
asyncFn(20, 1, p.push())
asyncFn(10, 2, p.push())
asyncFnErr(10, new Error('boom'), p.push())
p.some(2, function (err, val) {
  console.log(val) // [2, 1]
})

var p2 = parallels()
asyncFn(10, 1, p2.push())
asyncFnErr(10, new Error('boom'), p2.push())
p2.some(2, function (err, val) {
  console.log(err.message) // 'boom'
})
```

#### `p.race(done)`

Returns value or error of first callback being invoked.

```js
var p = parallels()
asyncFn(10, 1, p.push())
asyncFnErr(20, new Error('boom'), p.push())
p.race(function (err, val) {
  console.log(val) // 1
})

var p2 = parallels()
asyncFn(20, 1, p2.push())
asyncFnErr(10, new Error('boom'), p2.push())
p2.some(2, function (err, val) {
  console.log(err.message) // 'boom'
})
```

## License

MIT
