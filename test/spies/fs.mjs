import { replace } from 'fibble'
import { spy } from '../utils/index.mjs'

const mockFs = {
  readFile: spy(async () => ''),
  writeFile: spy(async () => undefined),
}

await replace('node:fs/promises', { default: mockFs })

export default mockFs
