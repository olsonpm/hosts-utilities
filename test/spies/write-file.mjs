import { replace } from 'fibble'
import { spy } from '../utils/index.mjs'
// fs needs to be mocked before parse-file
import './fs.mjs'

const { default: writeFile } = await import('#src/write-file')

const pathToModule = '../../src/write-file.mjs'

const writeFileSpy = spy(writeFile)
await replace(pathToModule, { default: writeFileSpy })

export default writeFileSpy
