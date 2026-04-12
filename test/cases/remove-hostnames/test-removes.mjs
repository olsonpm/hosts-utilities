import dedent from 'dedent'
import { expect } from 'chai'
import { fs } from '#test/spies/index'
import hostsPath from '#src/hosts-path'
import removeHostnames from '#src/remove-hostnames'

const testRemoves = () => {
  context('removes with correct formatting', () => {
    it('removes the first hostname', async () => {
      fs.readFile.result = '1.2.3.4 hostname1 hostname2 hostname3\n'
      await removeHostnames(['hostname1'])

      const expectedContent = '1.2.3.4 hostname2 hostname3\n'

      expect(fs.writeFile.argsPerCall).to.deep.equal([
        [hostsPath, expectedContent],
      ])
    })

    it('removes the middle hostname', async () => {
      fs.readFile.result = '1.2.3.4 hostname1 hostname2 hostname3\n'
      await removeHostnames(['hostname2'])

      const expectedContent = '1.2.3.4 hostname1 hostname3\n'

      expect(fs.writeFile.argsPerCall).to.deep.equal([
        [hostsPath, expectedContent],
      ])
    })

    it('removes the last hostname', async () => {
      fs.readFile.result = '1.2.3.4 hostname1 hostname2 hostname3\n'
      await removeHostnames(['hostname3'])

      const expectedContent = '1.2.3.4 hostname1 hostname2\n'

      expect(fs.writeFile.argsPerCall).to.deep.equal([
        [hostsPath, expectedContent],
      ])
    })

    it('removes the line if there are no more hostnames', async () => {
      fs.readFile.result = '1.2.3.4 hostname1\n'
      await removeHostnames(['hostname1'])

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
      fs.readFile.result = mockHostFile + '\n'
      await removeHostnames(['hostname1', 'hostname2'])

      const expectedContent = '1.2.3.4 hostname3\n'

      expect(fs.writeFile.argsPerCall).to.deep.equal([
        [hostsPath, expectedContent],
      ])
    })

    /**
     * note: matching by IP assumes an invalid host file since it only makes
     *   sense to map a host to a single IP.  Why support it then?  Mainly
     *   because hostility allowed removing hostnames by matching ip.  Meaning,
     *   I assume someone had a use case.
     */
    it('removes hostnames with matching ip', async () => {
      const mockHostFile = dedent(`
        1.2.3.4 hostname1 hostname2
        5.6.7.8 hostname1 hostname3
      `)
      fs.readFile.result = mockHostFile + '\n'
      await removeHostnames(['hostname1'], { withIp: '5.6.7.8' })

      const expectedContent = dedent(`
        1.2.3.4 hostname1 hostname2
        5.6.7.8 hostname3
      `)

      expect(fs.writeFile.argsPerCall).to.deep.equal([
        [hostsPath, expectedContent + '\n'],
      ])
    })
  })
}

export default testRemoves
