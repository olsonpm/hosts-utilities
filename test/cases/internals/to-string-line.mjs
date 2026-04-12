import { expect } from 'chai'
import toStringLine from '#src/internals/to-string-line'
import { spaces } from '#test/utils/index'

describe('internals/to-string-line', () => {
  it('returns the original line when data is empty', () => {
    const parsedLine = {
      original: 'original line',
      data: {},
    }
    expect(toStringLine(parsedLine)).to.equal('original line')
  })

  /**
   * note: although we always parse out the full data structure, we allow users
   *   to pass in data omitting empty properties.  The minimal data structure
   *   supported requires only ip and hostnamesWithSpace.
   */
  it('stringifies a minimal parsed line', () => {
    const parsedLine = {
      data: {
        ip: '1.2.3.4',
        hostnamesWithSpace: ['hostname1'],
      },
    }
    expect(toStringLine(parsedLine)).to.equal('1.2.3.4\thostname1')
  })

  it('stringifies a full parsed line', () => {
    const parsedLine = {
      data: {
        ip: '1.2.3.4',
        hostnamesWithSpace: ['hostname1', spaces[3], 'hostname2'],
        comment: '#some comment',
        space: {
          beforeIp: spaces[1],
          afterIp: spaces[2],
          beforeComment: spaces[4],
        },
      },
    }
    const expectedResult = `${spaces[1]}1.2.3.4${spaces[2]}hostname1${spaces[3]}hostname2${spaces[4]}#some comment`
    expect(toStringLine(parsedLine)).to.equal(expectedResult)
  })

  it('stringifies a full parsed line', () => {
    const parsedLine = {
      data: {
        ip: '1.2.3.4',
        hostnamesWithSpace: ['hostname1', spaces[3], 'hostname2'],
        comment: '#some comment',
        space: {
          beforeIp: spaces[1],
          afterIp: spaces[2],
          beforeComment: spaces[4],
        },
      },
    }
    const expectedResult = `${spaces[1]}1.2.3.4${spaces[2]}hostname1${spaces[3]}hostname2${spaces[4]}#some comment`
    expect(toStringLine(parsedLine)).to.equal(expectedResult)
  })

  /**
   * note: the reason we cover this use case is to allow people to pass data
   *   that reads well since the starting hash is redundant.  Our parsing
   *   includes the hash prefix, meaning it will only ever be missing in
   *   user-provided data.
   */
  it('handles a comment without a starting hash', () => {
    const parsedLine = {
      data: {
        ip: '1.2.3.4',
        hostnamesWithSpace: ['hostname1'],
        comment: 'some comment without a starting #',
        space: {
          beforeIp: spaces[1],
          afterIp: spaces[2],
          beforeComment: spaces[3],
        },
      },
    }
    const expectedResult = `${spaces[1]}1.2.3.4${spaces[2]}hostname1${spaces[3]}#some comment without a starting #`
    expect(toStringLine(parsedLine)).to.equal(expectedResult)
  })

  context('with options', () => {
    context('does not preserve formatting', () => {
      const ignoredSpace = spaces[4]

      specify('using default separators', () => {
        const options = {
          preserveFormatting: false,
        }
        const parsedLine = {
          data: {
            ip: '1.2.3.4',
            hostnamesWithSpace: ['hostname1', ignoredSpace, 'hostname2'],
            space: {
              beforeIp: ignoredSpace,
              afterIp: ignoredSpace,
              beforeComment: ignoredSpace,
            },
          },
        }
        const expectedResult = `1.2.3.4\thostname1 hostname2`
        expect(toStringLine(parsedLine, options)).to.equal(expectedResult)
      })

      specify('using provided separators', () => {
        const options = {
          preserveFormatting: false,
          separatorParts: spaces[3],
          separatorHostname: spaces[2],
        }
        const parsedLine = {
          data: {
            ip: '1.2.3.4',
            hostnamesWithSpace: ['hostname1', ignoredSpace, 'hostname2'],
            comment: '#some comment',
            space: {
              beforeIp: ignoredSpace,
              afterIp: ignoredSpace,
              beforeComment: ignoredSpace,
            },
          },
        }
        const expectedResult = `1.2.3.4${spaces[3]}hostname1${spaces[2]}hostname2${spaces[3]}#some comment`
        expect(toStringLine(parsedLine, options)).to.equal(expectedResult)
      })

      specify('and trims comment', () => {
        const options = {
          preserveFormatting: false,
        }
        const parsedLine = {
          data: {
            ip: '1.2.3.4',
            hostnamesWithSpace: ['hostname1'],
            comment: '#some comment ',
            space: {
              beforeIp: ignoredSpace,
              afterIp: ignoredSpace,
              beforeComment: ignoredSpace,
            },
          },
        }
        const expectedResult = `1.2.3.4\thostname1\t#some comment`
        expect(toStringLine(parsedLine, options)).to.equal(expectedResult)
      })
    })

    context('preserves formatting', () => {
      specify('using fallback separatorParts', () => {
        const options = {
          separatorParts: spaces[3],
        }
        const parsedLine = {
          data: {
            ip: '1.2.3.4',
            hostnamesWithSpace: ['hostname1', spaces[2], 'hostname2'],
            comment: '#some comment',
          },
        }
        const expectedResult = `1.2.3.4${spaces[3]}hostname1${spaces[2]}hostname2${spaces[3]}#some comment`
        expect(toStringLine(parsedLine, options)).to.equal(expectedResult)
      })
    })
  })
})
