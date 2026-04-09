import parseFile from './parse-file.mjs'
import hostsPath from './hosts-path.mjs'

const parse = async () => parseFile(hostsPath)

export default parse
