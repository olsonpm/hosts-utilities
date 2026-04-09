import writeFile from './write-file.mjs'
import hostsPath from './hosts-path.mjs'

const write = async (parsedLines, options = {}) =>
  writeFile(hostsPath, parsedLines, options)

export default write
