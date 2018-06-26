const path = require('path')
const fs = require('fs')

const example = path.join(__dirname, 'cache', 'bootstrap.css')
const css = fs.readFileSync(example).toString()

const tokenize = require('postcss/lib/tokenize')
const Input = require('postcss/lib/input')
const input = new Input(css)

module.exports = {
  name: 'Bootstrap',
  maxTime: 15,
  tests: [
    {
      name: 'PostCSS',
      defer: true,
      fn: done => {
        const t = tokenize(input)
        while (!t.endOfFile()) t.nextToken()
        done.resolve()
      }
    }
  ]
}

const devPath = path.join(__dirname, '../postcss/build/lib/tokenize.js')
if (fs.existsSync(devPath)) {
  const devTokenize = require(devPath)
  module.exports.tests.splice(1, 0, {
    name: 'PostCSS dev',
    defer: true,
    fn: done => {
      const t = devTokenize(input)
      while (!t.endOfFile()) t.nextToken()
      done.resolve()
    }
  })
}
