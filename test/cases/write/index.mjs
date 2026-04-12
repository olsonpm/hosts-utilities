import { expect } from 'chai'
import { fs, toStringLine } from '#test/spies/index'
import hostsPath from '#src/hosts-path'
import write from '#src/write'
import testValidatesInput from './test-validates-input.mjs'
import testWrites from './test-writes.mjs'

describe('write', () => {
  testValidatesInput()
  testWrites()

  it('writes to the correct file', async () => {
    const parsedLines = []
    await write(parsedLines)
    await write(parsedLines, { filePath: 'some/path' })

    expect(fs.writeFile.argsPerCall).to.deep.equal([
      [hostsPath, ''],
      ['some/path', ''],
    ])
  })

  it('calls toStringLine as expected', async () => {
    const options = {
      filePath: 'some/path',
      preserveFormatting: true,
    }
    const parsedLines = [
      {
        original: '#comment1',
        data: {},
      },
    ]
    await write(parsedLines, options)

    expect(toStringLine.argsPerCall).to.deep.equal([
      [parsedLines[0], { preserveFormatting: true }],
    ])
  })

  it('throws a friendly error upon EACCESS', async () => {
    const options = {
      filePath: 'some/protected/file',
    }
    const permErr = new Error(
      "EACCES: permission denied, open 'some/protected/file"
    )
    permErr.code = 'EACCES'
    fs.writeFile.fnOverride = () => Promise.reject(permErr)

    const result = write([], options)
    await expect(result)
      .to.be.rejectedWith(
        "You don't have permissions to write to some/protected/file"
      )
      .and.eventually.nested.include({ 'cause.code': 'EACCES' })
  })

  it('throws a friendly error upon EACCESS', async () => {
    const options = {
      filePath: 'some/protected/file',
    }
    const permErr = new Error(
      "EACCES: permission denied, open 'some/protected/file"
    )
    permErr.code = 'EACCES'
    fs.writeFile.fnOverride = () => Promise.reject(permErr)

    const result = write([], options)
    await expect(result)
      .to.be.rejectedWith(
        "You don't have permissions to write to some/protected/file"
      )
      .and.eventually.nested.include({ 'cause.code': 'EACCES' })
  })

  it('throws the raw error upon other file system errors', async () => {
    const options = {
      filePath: 'some/protected/file',
    }
    const permErr = new Error('any other filesystem error')
    permErr.code = 'UNKNOWN'
    fs.writeFile.fnOverride = () => Promise.reject(permErr)

    const result = write([], options)
    await expect(result).to.be.rejectedWith('any other filesystem error')
  })
})
