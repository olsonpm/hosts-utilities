import { expect } from 'chai'
import { fs, parse, write } from '#test/spies/index'
import hostsPath from '#src/hosts-path'
import remove from '#src/remove'

const testOptions = () => {
  context('options', () => {
    it('calls parse with the right file path', async () => {
      fs.readFile.resultPerCall = ['1.2.3.4 hostname1\n', '1.2.3.4 hostname1\n']
      await remove('1.2.3.4', ['hostname1'])
      await remove('1.2.3.4', ['hostname1'], { filePath: 'some/path' })
      expect(parse.argsPerCall).to.deep.equal([
        [{ filePath: hostsPath }],
        [{ filePath: 'some/path' }],
      ])
    })

    it('calls write with the correct arguments', async () => {
      fs.readFile.resultPerCall = [
        '1.2.3.4 hostname1 hostname2\n',
        '1.2.3.4 hostname1 hostname2\n',
      ]
      await remove('1.2.3.4', ['hostname2'], { preserveFormatting: true })
      await remove('1.2.3.4', ['hostname2'], {
        preserveFormatting: true,
        filePath: 'some/path',
      })

      const parsedLines = [
        {
          original: '1.2.3.4 hostname1 hostname2',
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
      expect(write.argsPerCall).to.deep.equal([
        [parsedLines, { filePath: hostsPath, preserveFormatting: true }],
        [parsedLines, { filePath: 'some/path', preserveFormatting: true }],
      ])
    })
  })
}

export default testOptions
