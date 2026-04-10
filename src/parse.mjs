import fsp from 'node:fs/promises'
import hostsPath from './hosts-path.mjs'
import { mapValues, passThrough, split } from './internals/fp-utils.mjs'
import { eol } from './internals/utils.mjs'
import parseLine from './internals/parse-line.mjs'

const parse = async (options = {}) => {
  const { filePath = hostsPath } = options
  const content = await fsp.readFile(filePath, 'utf8')
  if (!content.trim()) return []

  return passThrough(content, [split(eol), mapValues(parseLine)])
}

export default parse
