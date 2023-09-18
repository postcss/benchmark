/* Results on Node 20.3.1, Github Actions:

PostCSS: 11 ms
*/

let { existsSync, readFileSync } = require('node:fs')
let tokenize = require('postcss/lib/tokenize')
let { join } = require('node:path')
let Input = require('postcss/lib/input')

let example = join(__dirname, 'cache', 'bootstrap.css')
let css = readFileSync(example).toString()

let input = new Input(css)

module.exports = {
  maxTime: 15,
  name: 'Tokenizers',
  tests: [
    {
      defer: true,
      fn: done => {
        let t = tokenize(input)
        while (!t.endOfFile()) t.nextToken()
        done.resolve()
      },
      name: 'PostCSS'
    }
  ]
}

let devPath = join(__dirname, '../postcss/lib/tokenize.js')
if (existsSync(devPath)) {
  let devTokenize = require(devPath)
  let DevInput = require(join(__dirname, '../postcss/lib/input'))
  let devInput = new DevInput(css)
  module.exports.tests.splice(1, 0, {
    defer: true,
    fn: done => {
      let t = devTokenize(devInput)
      while (!t.endOfFile()) t.nextToken()
      done.resolve()
    },
    name: 'Next PostCSS'
  })
}
