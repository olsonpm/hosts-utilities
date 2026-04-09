import { replace } from 'fibble'
import { spy } from '../utils/index.mjs'
// parse-file needs to be mocked before parse
import './parse-file.mjs'

const { default: parse } = await import('#src/parse')

const pathToModule = '../../src/parse.mjs'

const parseSpy = spy(parse)
await replace(pathToModule, { default: parseSpy })

export default parseSpy
