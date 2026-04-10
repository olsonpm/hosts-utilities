import { expect } from 'chai'
import upsert from '#src/upsert'
import hostsPath from '#src/hosts-path'
import { fs, parseFile } from '#test/spies/index'
import testInserts from './test-inserts.mjs'
import testDoesNothing from './test-does-nothing.mjs'
import testAppends from './test-appends.mjs'
import testHandlesComments from './test-handles-comments.mjs'

describe('upsert', () => {
  testInserts()
  testDoesNothing()
  testAppends()
  testHandlesComments()

  it('calls parseFile with the right file path', async () => {
    fs.readFile.resultPerCall = ['1.2.3.4 hostname1\n', '1.2.3.4 hostname1\n']
    await upsert('1.2.3.4', ['hostname2'])
    await upsert('1.2.3.4', ['hostname2'], { filePath: 'path/to/other/file' })
    expect(parseFile.argsPerCall).to.deep.equal([
      [hostsPath],
      ['path/to/other/file'],
    ])
  })
})
