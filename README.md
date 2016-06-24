# parallels

Aggregate several callbacks into one array result. Like Promise.all for callbacks.

[![Build Status](https://travis-ci.org/cshum/parallels.svg?branch=master)](https://travis-ci.org/cshum/parallels)

```bash
npm install parallels
```

```js
var parallels = require('parallels')

var next = parallels()

asyncFn1(next.push()) // foo
asyncFn2(next.push()) // bar
asyncFn3(next.push()) // hello
asyncFn4(next.push()) // world

next.all(function (err, result) {
  // return err if any of them error
  // result array followed by all() sequence
  console.log(result) // ['foo', 'bar', 'hello', 'world']
})

```

## License

MIT
