import { expect } from 'chai'
import hostsPath from '#src/hosts-path'
import { parseFile } from '#test/spies/index'
import parse from '#src/parse'

describe('parse', () => {
  it('calls parseFile', async () => {
    await parse()
    expect(parseFile.argsPerCall).to.deep.equal([[hostsPath]])
  })
})
