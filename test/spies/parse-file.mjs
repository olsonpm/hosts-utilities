import { replace } from 'fibble'
import { spy } from '../utils/index.mjs'
// fs needs to be mocked before parse-file
import './fs.mjs'

const { default: parseFile } = await import('#src/parse-file')

const pathToModule = '../../src/parse-file.mjs'

const parseFileSpy = spy(parseFile)
await replace(pathToModule, { default: parseFileSpy })

export default parseFileSpy
