// eslint-disable-next-line import/no-extraneous-dependencies
const getbabelRelayPlugin = require('babel-relay-plugin')
const schema = require('./graphql/schema.json')

module.exports = getbabelRelayPlugin(schema.data)
