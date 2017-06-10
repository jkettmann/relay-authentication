import fs from 'fs'
import { printSchema } from 'graphql/utilities'
import path from 'path'

import schema from '../server/graphql/schema'

fs.writeFileSync(
  path.join(__dirname, '../server/graphql/schema.graphql'),
  printSchema(schema),
)
