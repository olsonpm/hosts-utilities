import fsp from 'node:fs/promises'
import toStringLine from './internals/to-string-line.mjs'
import { eol } from './internals/utils.mjs'

const writeFile = async (filePath, parsedLines, options = {}) => {
  let content = parsedLines
    .map(parsed => toStringLine(parsed, options))
    .join(eol)
  content = ensureLadenFileEndsWith(eol, content)
  await fsp.writeFile(filePath, content)
}

// 'laden' is my attempt at a positive 'non-empty' - to avoid double negatives
function ensureLadenFileEndsWith(suffix, str) {
  if (!str) return ''

  return str.endsWith(suffix) ? str : str + suffix
}

export default writeFile
