import dedent from 'dedent'
import { expect } from 'chai'
import { fs, write } from '#test/spies/index'
import assignHostnames from '#src/assign-hostnames'

const testDoesNothing = () => {
  context('does nothing', () => {
    it('does nothing when ip and hostname exists', async () => {
      fs.readFile.result = '1.2.3.4 hostname1\n'

      await assignHostnames('1.2.3.4', ['hostname1'])

      expect(write.calls.length).to.equal(0)
    })

    it('does nothing when all hostnames are assigned to the ip - on a single line', async () => {
      fs.readFile.result = '1.2.3.4 hostname1 hostname2\n'

      await assignHostnames('1.2.3.4', ['hostname1', 'hostname2'])

      expect(write.calls.length).to.equal(0)
    })

    it('does nothing when all hostnames are assigned to the ip - across lines', async () => {
      const mockHostFile = dedent(`
        1.2.3.4 hostname1
        1.2.3.4 hostname2
      `)
      fs.readFile.result = mockHostFile + '\n'

      await assignHostnames('1.2.3.4', ['hostname1', 'hostname2'])

      expect(write.calls.length).to.equal(0)
    })
  })
}

export default testDoesNothing
