import dedent from 'dedent'
import { expect } from 'chai'
import { fs, toStringLine } from '#test/spies/index'
import { spaces } from '#test/utils/index'
import hostsPath from '#src/hosts-path'
import write from '#src/write'
import { eol } from '#src/internals/utils'

describe('write', () => {
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
      everything: 'but filePath is passed',
    }
    const parsedLines = [
      {
        original: '#comment1',
        data: {},
      },
    ]
    await write(parsedLines, options)

    expect(toStringLine.argsPerCall).to.deep.equal([
      [parsedLines[0], { everything: 'but filePath is passed' }],
    ])
  })

  it('writes an empty file', async () => {
    const parsedLines = []
    await write(parsedLines)

    expect(fs.writeFile.argsPerCall).to.deep.equal([[hostsPath, '']])
  })

  it('writes a minimal file', async () => {
    const parsedLines = [
      {
        data: {
          ip: '1.2.3.4',
          hostnamesWithSpace: ['hostname1'],
        },
      },
    ]
    await write(parsedLines)

    const expectedContent = `1.2.3.4\thostname1${eol}`
    expect(fs.writeFile.argsPerCall).to.deep.equal([
      [hostsPath, expectedContent],
    ])
  })

  /**
   * note: to be clear, this ensures the output is the same as the previous test
   *   even with the trailing empty parsed line
   */
  it('only appends a newline as-needed', async () => {
    const parsedLines = [
      {
        data: {
          ip: '1.2.3.4',
          hostnamesWithSpace: ['hostname1'],
        },
      },
      {
        original: '',
        data: {},
      },
    ]
    await write(parsedLines)

    const expectedContent = `1.2.3.4\thostname1${eol}`
    expect(fs.writeFile.argsPerCall).to.deep.equal([
      [hostsPath, expectedContent],
    ])
  })

  it('writes a full file', async () => {
    const parsedLines = [
      {
        data: {
          ip: '1.2.3.4',
          hostnamesWithSpace: ['hostname1'],
        },
      },
      {
        original: `${spaces[1]}#some comment`,
        data: {},
      },
      {
        original: '',
        data: {},
      },
      {
        data: {
          ip: '5.6.7.8',
          hostnamesWithSpace: ['hostname2', spaces[3], 'hostname3'],
          comment: 'other comment',
          space: {
            beforeIp: spaces[1],
            beforeHostnames: spaces[2],
            beforeComment: spaces[4],
          },
        },
      },
    ]
    await write(parsedLines)

    const expectedContent = dedent(`
      1.2.3.4\thostname1
      ${spaces[1]}#some comment

      ${spaces[1]}5.6.7.8${spaces[2]}hostname2${spaces[3]}hostname3${spaces[4]}#other comment
    `)

    expect(fs.writeFile.argsPerCall).to.deep.equal([
      [hostsPath, expectedContent + '\n'],
    ])
  })
})
