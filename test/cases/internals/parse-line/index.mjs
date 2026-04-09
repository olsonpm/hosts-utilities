import { expect } from 'chai'
import parseLine from '#src/internals/parse-line'
import testWhenUsingSpaces from './test-when-using-spaces.mjs'
import testWhenUsingTabs from './test-when-using-tabs.mjs'

describe('internals/parse-line', () => {
  it('returns empty data when ip and hostname are absent', async () => {
    const testLines = [
      '',
      '#some comment',
      '  #some comment',
      'ip-without-hostname',
      'ip-without-hostname #comment',
    ]
    for (const line of testLines) {
      const result = parseLine(line)
      expect(result).to.deep.equal({
        original: line,
        data: {},
      })
    }
  })

  context('happy path', () => {
    testWhenUsingSpaces()
    testWhenUsingTabs()
  })
})
