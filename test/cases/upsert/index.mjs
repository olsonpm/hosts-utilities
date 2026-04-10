import { expect } from 'chai'
import dedent from 'dedent'
import upsert from '#src/upsert'
import testInserts from './test-inserts.mjs'
import testDoesNothing from './test-does-nothing.mjs'
import testAppends from './test-appends.mjs'
import testHandlesComments from './test-handles-comments.mjs'
import testOtherOptions from './test-other-options.mjs'

describe('upsert', () => {
  testInserts()
  testDoesNothing()
  testAppends()
  testHandlesComments()
  testOtherOptions()

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
      ✖ Invalid input: expected function, received number
        → at options.upsertComment
    `)

    const result = upsert(1, 2, {
      filePath: 3,
      upsertComment: 4,
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
