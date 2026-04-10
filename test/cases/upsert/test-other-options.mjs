import dedent from 'dedent'
import { expect } from 'chai'
import { fs, parse, write } from '#test/spies/index'
import hostsPath from '#src/hosts-path'
import upsert from '#src/upsert'

const testOtherOptions = () => {
  context('other options', () => {
    it('calls parse with the right file path', async () => {
      fs.readFile.resultPerCall = ['1.2.3.4 hostname1\n', '1.2.3.4 hostname1\n']
      await upsert('1.2.3.4', ['hostname2'])
      await upsert('1.2.3.4', ['hostname2'], { filePath: 'path/to/other/file' })
      expect(parse.argsPerCall).to.deep.equal([
        [{ filePath: hostsPath }],
        [{ filePath: 'path/to/other/file' }],
      ])
    })

    it('calls write with the correct arguments', async () => {
      fs.readFile.resultPerCall = ['1.2.3.4 hostname1\n', '1.2.3.4 hostname1\n']
      const options = {
        upsertComment: () => '',
        preserveFormatting: true,
      }
      await upsert('1.2.3.4', ['hostname2'], options)
      await upsert('1.2.3.4', ['hostname2'], {
        ...options,
        filePath: 'some/path',
      })

      const parsedLines = [
        {
          original: '1.2.3.4 hostname1',
          data: {
            ip: '1.2.3.4',
            hostnamesWithSpace: ['hostname1', ' ', 'hostname2'],
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

    it('inserts to an empty hostfile', async () => {
      fs.readFile.resultPerCall = ['']
      await upsert('1.2.3.4', ['hostname1'])

      const expectedContent = '1.2.3.4\thostname1\n'

      expect(fs.writeFile.argsPerCall).to.deep.equal([
        [hostsPath, expectedContent],
      ])
    })

    it("inserts when there's no matching ip", async () => {
      fs.readFile.resultPerCall = ['1.2.3.4 hostname1']
      await upsert('5.6.7.8', ['hostname2'])

      const expectedContent = dedent(`
        1.2.3.4 hostname1
        5.6.7.8\thostname2
      `)

      expect(fs.writeFile.argsPerCall).to.deep.equal([
        [hostsPath, expectedContent + '\n'],
      ])
    })
  })
}

export default testOtherOptions
