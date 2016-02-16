# callback-all

Aggregate several callbacks into one array result. Like Promise.all for callbacks.

[![Build Status](https://travis-ci.org/cshum/callback-all.svg?branch=master)](https://travis-ci.org/cshum/callback-all)

```bash
npm install callback-all
```

```js
var cball = require('callback-all')

var all = cball()

asyncFn1(all()) // foo
asyncFn2(all()) // bar
asyncFn3(all()) // hello
asyncFn4(all()) // world

all(function (err, result) {
  // return err if any of them error
  // result array followed by all() sequence
  console.log(result) // ['foo', 'bar', 'hello', 'world']
})

```

## License

MIT
