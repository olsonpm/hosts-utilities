import { expect } from 'chai'
import parseLine from '#src/internals/parse-line'
import { tabs } from '#test/utils/index'

const testWhenUsingTabs = () => {
  context('when using tabs', () => {
    it('parses a minimal line', () => {
      const line = '1.2.3.4\thostname1'

      expect(parseLine(line)).to.deep.equal({
        original: line,
        data: {
          ip: '1.2.3.4',
          hostnamesWithSpace: ['hostname1'],
          comment: '',
          space: {
            beforeIp: '',
            afterIp: '\t',
            beforeComment: '',
          },
        },
      })
    })

    it('parses a full line', () => {
      const line = `${tabs[1]}1.2.3.4${tabs[2]}hostname1${tabs[3]}hostname2${tabs[4]}#some comment `

      expect(parseLine(line)).to.deep.equal({
        original: line,
        data: {
          ip: '1.2.3.4',
          hostnamesWithSpace: ['hostname1', tabs[3], 'hostname2'],
          comment: '#some comment ',
          space: {
            beforeIp: tabs[1],
            afterIp: tabs[2],
            beforeComment: tabs[4],
          },
        },
      })
    })
  })
}

export default testWhenUsingTabs
