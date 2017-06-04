import fs from 'fs'
import { printSchema } from 'graphql/utilities'
import path from 'path'

import schema from '../graphql/schema'

fs.writeFileSync(
  path.join(__dirname, '../graphql/schema.graphql'),
  printSchema(schema),
)
