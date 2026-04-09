import { replace } from 'fibble'
import { spy } from '../utils/index.mjs'
import toStringLine from '#src/internals/to-string-line'

const pathToModule = '../../src/internals/to-string-line.mjs'

const toStringLineSpy = spy(toStringLine)
await replace(pathToModule, { default: toStringLineSpy })

export default toStringLineSpy
