import { replace } from 'fibble'
import { spy } from '../utils/index.mjs'
import parseLine from '#src/internals/parse-line'

const pathToModule = '../../src/internals/parse-line.mjs'

const parseLineSpy = spy(parseLine)
await replace(pathToModule, { default: parseLineSpy })

export default parseLineSpy
