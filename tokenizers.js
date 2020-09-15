let { readFileSync, existsSync } = require('fs')
let tokenize = require('postcss/lib/tokenize')
let { join } = require('path')
let Input = require('postcss/lib/input')

let example = join(__dirname, 'cache', 'bootstrap.css')
let css = readFileSync(example).toString()

let input = new Input(css)

module.exports = {
  name: 'Tokenizers',
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

let devPath = join(__dirname, '../postcss/lib/tokenize.js')
if (existsSync(devPath)) {
  let devTokenize = require(devPath)
  let DevInput = require(join(__dirname, '../postcss/lib/input'))
  let devInput = new DevInput(css)
  module.exports.tests.splice(1, 0, {
    name: 'Next PostCSS',
    defer: true,
    fn: done => {
      let t = devTokenize(devInput)
      while (!t.endOfFile()) t.nextToken()
      done.resolve()
    }
  })
}
