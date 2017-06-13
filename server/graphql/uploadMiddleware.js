import multer from 'multer'
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import sanitize from 'sanitize-filename'

const UPLOAD_PATH = path.resolve(__dirname, '../../static/images/upload')

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

    // Parse variables so we can add to them
    // (express-graphql won't parse them again once populated)
    req.body.variables = JSON.parse(req.body.variables)

    files.forEach((fileArray) => {
      const file = fileArray[0]

      // add hash to sanitized file name
      const filename = `${Date.now()}_${sanitize(
        file.originalname.replace(
          /[`~!@#$%^&*()_|+\-=÷¿?;:'",<>{}[]\\\/]/gi,
          '',
        ),
      )}`

      // save file to disk
      const filePath = path.join(
        UPLOAD_PATH,
        filename,
      )
      fs.writeFileSync(filePath, file.buffer)

      // Add files to graphql input. We only support single images here.
      // In our case the image field for the CreatePostMutation is populated
      // with the uploaded images URL
      req.body.variables.input[file.fieldname] = `/images/upload/${filename}`

      // eslint-disable-next-line no-undef
      log(`upload middleware: uploaded file ${file.originalname} to ${req.body.variables.input[file.fieldname]}`)
    })

    next()
  })
}

export default uploadMiddleWare
