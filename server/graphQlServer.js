import express from 'express'
import graphQLHTTP from 'express-graphql'
import cookieSession from 'cookie-session'
import multer from 'multer'
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import sanitize from 'sanitize-filename'

import Schema from '../graphql/schema'
import {
  decodeToken,
  createAnonymousToken,
  ANONYMOUS_TOKEN_DATA,
} from './authentication'

function loadSessionData(req) {
  if (req.session && req.session.token) {
    return new Promise(resolve => {
      let tokenData = null
      try {
        tokenData = decodeToken(req.session.token)
      } catch (err) {
        // eslint-disable-next-line no-undef
        log(err)
      }
      resolve(tokenData)
    })
  }

  return new Promise(resolve => {
    resolve(null)
  })
}

function getSessionData(req, res, next) {
  loadSessionData(req)
    .then(tokenData => {
      if (tokenData) {
        return tokenData
      }

      // set an anonymous session token
      req.session.token = createAnonymousToken()
      return ANONYMOUS_TOKEN_DATA
    })
    .then(tokenData => {
      req.tokenData = tokenData
      next()
    })
    .catch(() => {
      res.sendStatus(400)
    })
}

export default function createGraphQlServer(port, database) {
  const graphQLServer = express()

  graphQLServer.use(
    cookieSession({
      name: 'session',
      keys: ['id', 'token'],
    }),
  )

  const storage = multer.memoryStorage()

  const multerMiddleware = multer({ storage }).fields([{ name: 'image' }])

  const uploadMiddleWare = (req, res, next) => {
    multerMiddleware(req, res, () => {
      // request contains file data in req.files in format
      // {
      //   key: [{
      //     fieldname,
      //     originalname,
      //     encoding,
      //     mimetype,
      //     buffer,
      //     size
      //   }]
      // }

      // convert to array in format
      // [
      //   [fieldname, originalname ...]
      // ]
      const files = _.values(req.files)

      if (!files || files.length === 0) {
        // eslint-disable-next-line no-undef
        log('upload middleware: no files')
        next()
        return
      }

      // Parse variables so we can add to them. (express-graphql won't parse them again once populated)
      req.body.variables = JSON.parse(req.body.variables)

      files.forEach(fileArray => {
        const file = fileArray[0]
        const filename = `${Date.now()}_${sanitize(
          file.originalname.replace(
            /[`~!@#$%^&*()_|+\-=÷¿?;:'",<>{}[]\\\/]/gi,
            '',
          ),
        )}`

        // save file to disk
        const filePath = path.join(
          __dirname,
          '../data/testData/images',
          filename,
        )
        fs.writeFileSync(filePath, file.buffer)

        // add files to graphql input. we only support single images here
        req.body.variables.input[file.fieldname] = `/images/${filename}`
      })

      next()
    })
  }

  graphQLServer.use('/graphql', uploadMiddleWare)

  graphQLServer.use(
    '/graphql',
    getSessionData,
    graphQLHTTP(({ session, tokenData }) => ({
      graphiql: true,
      pretty: true,
      schema: Schema,
      context: { db: database },
      rootValue: { session, tokenData },
    })),
  )

  return graphQLServer.listen(port, () =>
    // eslint-disable-next-line no-undef
    log(`GraphQL Server is now running on http://localhost:${port}`),
  )
}
