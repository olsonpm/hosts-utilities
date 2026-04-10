import fsp from 'node:fs/promises'
import hostsPath from './hosts-path.mjs'
import toStringLine from './internals/to-string-line.mjs'
import { eol } from './internals/utils.mjs'

const write = async (parsedLines, options = {}) => {
  const { filePath = hostsPath, ...formatOptions } = options
  let content = parsedLines
    .map(parsed => toStringLine(parsed, formatOptions))
    .join(eol)
  content = ensureLadenFileEndsWith(eol, content)
  await fsp.writeFile(filePath, content)
}

// 'laden' is my attempt at a positive 'non-empty' - to avoid double negatives
function ensureLadenFileEndsWith(suffix, str) {
  if (!str) return ''

  return str.endsWith(suffix) ? str : str + suffix
}

export default write
