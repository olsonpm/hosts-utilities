import dedent from 'dedent'
import { expect } from 'chai'
import { fs } from '#test/spies/index'
import upsert from '#src/upsert'
import hostsPath from '#src/hosts-path'

const testAppends = () => {
  context('appends', () => {
    it('appends hostname to an existing ip', async () => {
      fs.readFile.resultPerCall = ['1.2.3.4 hostname1\n']
      await upsert('1.2.3.4', ['hostname2'])

      const expectedContent = '1.2.3.4 hostname1 hostname2\n'

      expect(fs.writeFile.argsPerCall).to.deep.equal([
        [hostsPath, expectedContent],
      ])
    })

    it('appends hostname to the last matching ip', async () => {
      const mockHostFile = dedent(`
        1.2.3.4 hostname1
        1.2.3.4 hostname2
      `)
      fs.readFile.resultPerCall = [mockHostFile + '\n']
      await upsert('1.2.3.4', ['hostname3'])

      const expectedContent = dedent(`
        1.2.3.4 hostname1
        1.2.3.4 hostname2 hostname3
      `)
      expect(fs.writeFile.argsPerCall).to.deep.equal([
        [hostsPath, expectedContent + '\n'],
      ])
    })

    it('appends absent hostnames to the last matching ip', async () => {
      const mockHostFile = dedent(`
        1.2.3.4 hostname3
        1.2.3.4 hostname2
      `)
      fs.readFile.resultPerCall = [mockHostFile + '\n']
      await upsert('1.2.3.4', ['hostname1', 'hostname3', 'hostname4'])

      const expectedContent = dedent(`
        1.2.3.4 hostname3
        1.2.3.4 hostname2 hostname1 hostname4
      `)
      expect(fs.writeFile.argsPerCall).to.deep.equal([
        [hostsPath, expectedContent + '\n'],
      ])
    })
  })
}

export default testAppends
