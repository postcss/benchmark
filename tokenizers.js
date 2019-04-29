let tokenize = require('postcss/lib/tokenize')
let Input = require('postcss/lib/input')
let path = require('path')
let fs = require('fs')

let example = path.join(__dirname, 'cache', 'bootstrap.css')
let css = fs.readFileSync(example).toString()

let input = new Input(css)

module.exports = {
  name: 'Bootstrap',
  maxTime: 15,
  tests: [
    {
      name: 'PostCSS',
      defer: true,
      fn: done => {
        let t = tokenize(input)
        while (!t.endOfFile()) t.nextToken()
        done.resolve()
      }
    }
  ]
}

let devPath = path.join(__dirname, '../postcss/build/lib/tokenize.js')
if (fs.existsSync(devPath)) {
  let devTokenize = require(devPath)
  module.exports.tests.splice(1, 0, {
    name: 'PostCSS dev',
    defer: true,
    fn: done => {
      let t = devTokenize(input)
      while (!t.endOfFile()) t.nextToken()
      done.resolve()
    }
  })
}
