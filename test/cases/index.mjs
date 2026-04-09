import { expect } from 'chai'
import * as hostsUtilities from '#src/index'
import hostsPath from '#src/hosts-path'
import parseFile from '#src/parse-file'
import parse from '#src/parse'
import upsert from '#src/upsert'
import writeFile from '#src/write-file'
import write from '#src/write'

describe('index', () => {
  it('exports what we expect', () => {
    expect(hostsUtilities).to.deep.match({
      hostsPath,
      parseFile,
      parse,
      upsert,
      writeFile,
      write,
    })
  })
})
