import { expect } from 'chai'
import { writeFile } from '#test/spies/index'
import write from '#src/write'
import hostsPath from '#src/hosts-path'

describe('write', () => {
  it('calls writeFile', async () => {
    writeFile.resultPerCall = [Promise.resolve(undefined)]
    await write('parsed lines', 'options')
    expect(writeFile.argsPerCall).to.deep.equal([
      [hostsPath, 'parsed lines', 'options'],
    ])
  })
})
