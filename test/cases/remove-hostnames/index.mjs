import { expect } from 'chai'
import dedent from 'dedent'
import { fs } from '#test/spies/index'
import hostsPath from '#src/hosts-path'
import removeHostnames from '#src/remove-hostnames'
import testRemoves from './test-removes.mjs'
import testDoesNothing from './test-does-nothing.mjs'
import testOptions from './test-options.mjs'

describe('remove-hostnames', () => {
  testRemoves()
  testDoesNothing()
  testOptions()

  it('leaves comments as-is', async () => {
    fs.readFile.resultPerCall = ['1.2.3.4 hostname1 hostname2 #some comment\n']
    await removeHostnames(['hostname1'])

    const expectedContent = '1.2.3.4 hostname2 #some comment\n'

    expect(fs.writeFile.argsPerCall).to.deep.equal([
      [hostsPath, expectedContent],
    ])
  })

  it('validates the arguments', async () => {
    const expectedMsg = dedent(`
      Arguments failed the schema
      ✖ Invalid input: expected array, received number
        → at hostnames
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
      ✖ Invalid input: expected string, received number
        → at options.withIp
    `)
    const result = removeHostnames(1, {
      filePath: 2,
      withIp: 3,
      preserveFormatting: 4,
      separatorParts: 5,
      separatorHostname: 6,
      invalid: true,
    })

    await expect(result)
      .to.be.rejectedWith(expectedMsg)
      .and.eventually.have.property('cause')
  })
})
