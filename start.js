// Server-side entrypoint that registers Babel's require() hook
// eslint-disable-next-line import/no-extraneous-dependencies
const babelRegister = require('babel-register')

babelRegister()

require('./server')
