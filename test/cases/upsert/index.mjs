import testInserts from './test-inserts.mjs'
import testDoesNothing from './test-does-nothing.mjs'
import testAppends from './test-appends.mjs'
import testHandlesComments from './test-handles-comments.mjs'

describe('upsert', () => {
  testInserts()
  testDoesNothing()
  testAppends()
  testHandlesComments()
})
