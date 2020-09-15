let { readFileSync, readFile } = require('fs')
let { promisify } = require('util')
let { join } = require('path')
let postcss = require('postcss')

let readFileAsync = promisify(readFile)
let example = join(__dirname, 'cache', 'bootstrap.css')
let css = readFileSync(example).toString()

for (let i = 0; i < 4; i++) {
  css = css + css
}

let walkColorPlugin = () => {
  return {
    postcssPlugin: 'walkColorPlugin',
    Root (root) {
      root.walkDecls('color', decl => {
        decl.value = 'black'
      })
    }
  }
}
walkColorPlugin.postcss = true

let walkWebkitPlugin = () => {
  return {
    postcssPlugin: 'walkWebkitPlugin',
    Root (root) {
      root.walkDecls(/^webkit-*/, decl => {
        decl.remove()
      })
    }
  }
}
walkWebkitPlugin.postcss = true

let walkSyncPlugin = () => {
  return {
    postcssPlugin: 'walkSyncPlugin',
    Root (root) {
      root.walkAtRules(node => {
        readFileSync(example)
        node.remove()
      })
    }
  }
}
walkSyncPlugin.postcss = true

let walkAsyncPlugin = () => {
  return {
    postcssPlugin: 'walkAsyncPlugin',
    async Root (root) {
      let atRules = []
      root.walkAtRules(atRule => {
        atRules.push(atRule)
        atRule.remove()
      })
      for (let i = 0; i < atRules.length; i++) {
        await readFileAsync(example)
      }
    }
  }
}
walkAsyncPlugin.postcss = true

let visitColorPlugin = () => {
  return {
    postcssPlugin: 'visitColorPlugin',
    Declaration: {
      color: decl => {
        decl.value = 'black'
      }
    }
  }
}
visitColorPlugin.postcss = true

let visitWebkitPlugin = () => {
  return {
    postcssPlugin: 'visitWebkitPlugin',
    Declaration (decl) {
      if (decl.prop.startsWith('-webkit-')) {
        decl.remove()
      }
    }
  }
}
visitWebkitPlugin.postcss = true

let visitSyncPlugin = () => {
  return {
    postcssPlugin: 'visitSyncPlugin',
    AtRule (node) {
      readFileSync(example)
      node.remove()
    }
  }
}
visitSyncPlugin.postcss = true

let visitAsyncPlugin = () => {
  return {
    postcssPlugin: 'visitAsyncPlugin',
    async AtRule (node) {
      await readFileAsync(example)
      node.remove()
    }
  }
}
visitAsyncPlugin.postcss = true

function multiple (count, value) {
  return Array(count).fill(value)
}

let walkerSync = postcss(
  multiple(10, walkColorPlugin)
    .concat(multiple(10, walkWebkitPlugin))
    .concat([walkSyncPlugin])
)
let walkerAsync = postcss(
  multiple(10, walkColorPlugin)
    .concat(multiple(10, walkWebkitPlugin))
    .concat([walkAsyncPlugin])
)
let visiterSync = postcss(
  multiple(10, visitColorPlugin)
    .concat(multiple(10, visitWebkitPlugin))
    .concat([visitSyncPlugin])
)
let visiterAsync = postcss(
  multiple(10, visitColorPlugin)
    .concat(multiple(10, visitWebkitPlugin))
    .concat([visitAsyncPlugin])
)

module.exports = {
  name: 'API',
  maxTime: 15,
  tests: [
    {
      name: 'Walk sync API',
      defer: true,
      fn: done => {
        walkerSync.process(css, { from: example, map: false }).css
        walkerSync.process(css, { from: example, map: false }).css
        walkerSync.process(css, { from: example, map: false }).css
        done.resolve()
      }
    },
    {
      name: 'Visitor sync API',
      defer: true,
      fn: done => {
        visiterSync.process(css, { from: example, map: false }).css
        visiterSync.process(css, { from: example, map: false }).css
        visiterSync.process(css, { from: example, map: false }).css
        done.resolve()
      }
    },
    {
      name: 'Walk async API',
      defer: true,
      fn: done => {
        Promise.all([
          walkerAsync.process(css, { from: example, map: false }),
          walkerAsync.process(css, { from: example, map: false }),
          walkerAsync.process(css, { from: example, map: false })
        ]).then(() => {
          done.resolve()
        })
      }
    },
    {
      name: 'Visitor async API',
      defer: true,
      fn: done => {
        Promise.all([
          visiterAsync.process(css, { from: example, map: false }),
          visiterAsync.process(css, { from: example, map: false }),
          visiterAsync.process(css, { from: example, map: false })
        ]).then(() => {
          done.resolve()
        })
      }
    }
  ]
}
