import dedent from 'dedent'
import { expect } from 'chai'
import { fs } from '#test/spies/index'
import hostsPath from '#src/hosts-path'
import remove from '#src/remove'

const testRemoves = () => {
  context('removes', () => {
    it('removes the first hostname', async () => {
      fs.readFile.resultPerCall = ['1.2.3.4 hostname1 hostname2 hostname3\n']
      await remove('1.2.3.4', ['hostname1'])

      const expectedContent = '1.2.3.4 hostname2 hostname3\n'

      expect(fs.writeFile.argsPerCall).to.deep.equal([
        [hostsPath, expectedContent],
      ])
    })

    it('removes the middle hostname', async () => {
      fs.readFile.resultPerCall = ['1.2.3.4 hostname1 hostname2 hostname3\n']
      await remove('1.2.3.4', ['hostname2'])

      const expectedContent = '1.2.3.4 hostname1 hostname3\n'

      expect(fs.writeFile.argsPerCall).to.deep.equal([
        [hostsPath, expectedContent],
      ])
    })

    it('removes the last hostname', async () => {
      fs.readFile.resultPerCall = ['1.2.3.4 hostname1 hostname2 hostname3\n']
      await remove('1.2.3.4', ['hostname3'])

      const expectedContent = '1.2.3.4 hostname1 hostname2\n'

      expect(fs.writeFile.argsPerCall).to.deep.equal([
        [hostsPath, expectedContent],
      ])
    })

    it('removes the line if there are no more hostnames', async () => {
      fs.readFile.resultPerCall = ['1.2.3.4 hostname1\n']
      await remove('1.2.3.4', ['hostname1'])

      const expectedContent = ''

      expect(fs.writeFile.argsPerCall).to.deep.equal([
        [hostsPath, expectedContent],
      ])
    })

    it('removes hostnames across multiple lines', async () => {
      const mockHostFile = dedent(`
        1.2.3.4 hostname1
        1.2.3.4 hostname2 hostname3
      `)
      fs.readFile.resultPerCall = [mockHostFile + '\n']
      await remove('1.2.3.4', ['hostname1', 'hostname2'])

      const expectedContent = '1.2.3.4 hostname3\n'

      expect(fs.writeFile.argsPerCall).to.deep.equal([
        [hostsPath, expectedContent],
      ])
    })
  })
}

export default testRemoves
