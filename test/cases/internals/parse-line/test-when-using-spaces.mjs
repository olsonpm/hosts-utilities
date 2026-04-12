import { expect } from 'chai'
import parseLine from '#src/internals/parse-line'
import { spaces } from '#test/utils/index'

const testWhenUsingSpaces = () => {
  context('when using spaces', () => {
    it('parses a minimal line', () => {
      const line = '1.2.3.4 hostname1'

      expect(parseLine(line)).to.deep.equal({
        original: line,
        data: {
          ip: '1.2.3.4',
          hostnamesWithSpace: ['hostname1'],
          comment: '',
          space: {
            beforeIp: '',
            afterIp: ' ',
            beforeComment: '',
          },
        },
      })
    })

    it('parses a full line', () => {
      const line = `${spaces[1]}1.2.3.4${spaces[2]}hostname1${spaces[3]}hostname2${spaces[4]}#some comment `

      expect(parseLine(line)).to.deep.equal({
        original: line,
        data: {
          ip: '1.2.3.4',
          hostnamesWithSpace: ['hostname1', spaces[3], 'hostname2'],
          comment: '#some comment ',
          space: {
            beforeIp: spaces[1],
            afterIp: spaces[2],
            beforeComment: spaces[4],
          },
        },
      })
    })
  })
}

export default testWhenUsingSpaces
