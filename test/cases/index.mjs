import { expect } from 'chai'
import * as hostsUtilities from '#src/index'
import hostsPath from '#src/hosts-path'
import parse from '#src/parse'
import removeHostnames from '#src/remove-hostnames'
import upsert from '#src/upsert'
import write from '#src/write'

describe('index', () => {
  it('exports what we expect', () => {
    expect(hostsUtilities).to.deep.match({
      hostsPath,
      parse,
      removeHostnames,
      upsert,
      write,
    })
  })
})
