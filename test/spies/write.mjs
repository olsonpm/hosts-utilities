import { replace } from 'fibble'
import { spy } from '../utils/index.mjs'
// write-file needs to be mocked before write
import './write-file.mjs'

const { default: write } = await import('#src/write')

const pathToModule = '../../src/write.mjs'

const writeSpy = spy(write)
await replace(pathToModule, { default: writeSpy })

export default writeSpy
