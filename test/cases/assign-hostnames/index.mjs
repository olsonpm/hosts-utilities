import { expect } from 'chai'
import dedent from 'dedent'
import hostsPath from '#src/hosts-path'
import assignHostnames from '#src/assign-hostnames'
import { fs } from '#test/spies/index'
import testInserts from './test-inserts.mjs'
import testDoesNothing from './test-does-nothing.mjs'
import testAppends from './test-appends.mjs'
import testOtherOptions from './test-other-options.mjs'

describe('assign-hostnames', () => {
  testInserts()
  testDoesNothing()
  testAppends()
  testOtherOptions()

  it('keeps existing comments', async () => {
    fs.readFile.result = '1.2.3.4 hostname1 #some comment\n'
    await assignHostnames('1.2.3.4', ['hostname2'])

    const expectedContent = '1.2.3.4 hostname1 hostname2 #some comment\n'

    expect(fs.writeFile.argsPerCall).to.deep.equal([
      [hostsPath, expectedContent],
    ])
  })

  it('validates the arguments', async () => {
    const expectedMsg = dedent(`
      Arguments failed the schema
      ✖ Invalid input: expected array, received number
        → at hostnames
      ✖ Invalid input: expected string, received number
        → at ip
      ✖ Unrecognized key: "invalid"
        → at options
      ✖ Invalid input: expected string, received number
        → at options.filePath
      ✖ Invalid input: expected boolean, received number
        → at options.preserveFormatting
      ✖ Invalid input: expected string, received number
        → at options.separatorHostname
      ✖ Invalid input: expected string, received number
        → at options.separatorParts
    `)

    const result = assignHostnames(1, 2, {
      filePath: 3,
      preserveFormatting: 5,
      separatorParts: 6,
      separatorHostname: 7,
      invalid: true,
    })

    await expect(result)
      .to.be.rejectedWith(expectedMsg)
      .and.eventually.have.property('cause')
  })
})
