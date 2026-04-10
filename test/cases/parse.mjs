import dedent from 'dedent'
import { expect } from 'chai'
import { fs, parseLine } from '#test/spies/index'
import { spaces, tabs } from '#test/utils/index'
import hostsPath from '#src/hosts-path'
import parse from '#src/parse'

const mockFile = getMockFiles()

describe('parse', () => {
  it('validates the arguments', async () => {
    const expectedMsg = dedent(`
      Arguments failed the schema
      ✖ Unrecognized key: "invalid"
        → at options
      ✖ Invalid input: expected string, received number
        → at options.filePath
    `)
    const result = parse({ filePath: 1, invalid: true })

    await expect(result)
      .to.be.rejectedWith(expectedMsg)
      .and.eventually.have.property('cause')
  })

  it('reads the correct file', async () => {
    fs.readFile.resultPerCall = [mockFile.minimal, mockFile.minimal]
    await parse()
    await parse({ filePath: 'some/path/to/file' })
    expect(fs.readFile.argsPerCall).to.deep.equal([
      [hostsPath, 'utf8'],
      ['some/path/to/file', 'utf8'],
    ])
  })

  it('calls parseLine as expected', async () => {
    fs.readFile.resultPerCall = [mockFile.minimal]
    await parse()

    // deep matching since we only care about the first argument passed per call
    expect(parseLine.argsPerCall).to.deep.match([['1.2.3.4 hostname1'], ['']])
    expect(parseLine.calls.length).to.equal(2)
  })

  it('parses an empty file', async () => {
    fs.readFile.resultPerCall = [mockFile.empty]
    const result = await parse()

    expect(result).to.deep.equal([])
  })

  it('treats a file with only space characters as empty', async () => {
    fs.readFile.resultPerCall = [mockFile.onlySpace]
    const result = await parse()

    expect(result).to.deep.equal([])
  })

  it('parses a minimal file', async () => {
    fs.readFile.resultPerCall = [mockFile.minimal]
    const result = await parse()

    const expectedResult = [
      {
        original: '1.2.3.4 hostname1',
        data: {
          ip: '1.2.3.4',
          hostnamesWithSpace: ['hostname1'],
          comment: '',
          space: {
            beforeIp: '',
            beforeHostnames: ' ',
            beforeComment: '',
          },
        },
      },
      {
        original: '',
        data: {},
      },
    ]
    expect(result).to.deep.equal(expectedResult)
  })

  it('parses a full file', async () => {
    fs.readFile.resultPerCall = [mockFile.full]
    const result = await parse()

    const expectedResult = [
      {
        original: '1.2.3.4 hostname1',
        data: {
          ip: '1.2.3.4',
          hostnamesWithSpace: ['hostname1'],
          comment: '',
          space: {
            beforeIp: '',
            beforeHostnames: ' ',
            beforeComment: '',
          },
        },
      },
      {
        original: '',
        data: {},
      },
      {
        original: `${spaces[1]}#some comment`,
        data: {},
      },
      {
        original: `${spaces[1]}5.6.7.8${spaces[2]}hostname2${spaces[3]}hostname3${spaces[4]}#other comment`,
        data: {
          ip: '5.6.7.8',
          hostnamesWithSpace: ['hostname2', spaces[3], 'hostname3'],
          comment: '#other comment',
          space: {
            beforeIp: spaces[1],
            beforeHostnames: spaces[2],
            beforeComment: spaces[4],
          },
        },
      },
      {
        original: '',
        data: {},
      },
    ]
    expect(result).to.deep.equal(expectedResult)
  })
})

function getMockFiles() {
  const minimal = '1.2.3.4 hostname1\n'
  let full = dedent(`
    1.2.3.4 hostname1

    ${spaces[1]}#some comment
    ${spaces[1]}5.6.7.8${spaces[2]}hostname2${spaces[3]}hostname3${spaces[4]}#other comment
  `)

  full += '\n'

  return {
    empty: '',
    onlySpace: `\n\n${spaces[1]}\n${tabs[2]}\n`,
    minimal,
    full,
  }
}
