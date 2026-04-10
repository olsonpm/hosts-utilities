import fsp from 'node:fs/promises'
import * as z from 'zod'
import hostsPath from './hosts-path.mjs'
import { mapValues, passThrough, split } from './internals/fp-utils.mjs'
import {
  ladenString,
  partialObject,
  validate,
} from './internals/schema-utils.mjs'
import { eol } from './internals/utils.mjs'
import parseLine from './internals/parse-line.mjs'

const parse = async (options = {}) => {
  validate({ options }, getArgsSchema)

  const { filePath = hostsPath } = options
  const content = await fsp.readFile(filePath, 'utf8')
  if (!content.trim()) return []

  return passThrough(content, [split(eol), mapValues(parseLine)])
}

function getArgsSchema() {
  return z.object({
    options: partialObject({
      filePath: ladenString(),
    }),
  })
}

export default parse
