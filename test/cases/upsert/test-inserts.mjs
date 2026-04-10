import dedent from 'dedent'
import { expect } from 'chai'
import { fs } from '#test/spies/index'
import hostsPath from '#src/hosts-path'
import upsert from '#src/upsert'

const testInserts = () => {
  context('inserts', () => {
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

export default testInserts
