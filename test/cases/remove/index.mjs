import { expect } from 'chai'
import { fs } from '#test/spies/index'
import hostsPath from '#src/hosts-path'
import remove from '#src/remove'
import testRemoves from './test-removes.mjs'
import testDoesNothing from './test-does-nothing.mjs'
import testOptions from './test-options.mjs'

describe('remove', () => {
  testRemoves()
  testDoesNothing()
  testOptions()

  it('leaves comments as-is', async () => {
    fs.readFile.resultPerCall = ['1.2.3.4 hostname1 hostname2 #some comment\n']
    await remove('1.2.3.4', ['hostname1'])

    const expectedContent = '1.2.3.4 hostname2 #some comment\n'

    expect(fs.writeFile.argsPerCall).to.deep.equal([
      [hostsPath, expectedContent],
    ])
  })
})
