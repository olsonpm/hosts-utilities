import dedent from 'dedent'
import { expect } from 'chai'
import { fs, write } from '#test/spies/index'
import { spy } from '#test/utils/index'
import upsert from '#src/upsert'

const testDoesNothing = () => {
  context('does nothing', () => {
    it('does nothing when ip and hostname exists', async () => {
      fs.readFile.resultPerCall = ['1.2.3.4 hostname1\n']

      const notCalled = spy(() => 'not called')
      await upsert('1.2.3.4', ['hostname1'], { upsertComment: notCalled })

      expect(notCalled.calls.length).to.equal(0)
      expect(write.calls.length).to.equal(0)
    })

    it('does nothing when all hostnames are assigned to the ip - on a single line', async () => {
      fs.readFile.resultPerCall = ['1.2.3.4 hostname1 hostname2\n']

      await upsert('1.2.3.4', ['hostname1', 'hostname2'])

      expect(write.calls.length).to.equal(0)
    })

    it('does nothing when all hostnames are assigned to the ip - across lines', async () => {
      const mockHostFile = dedent(`
        1.2.3.4 hostname1
        1.2.3.4 hostname2
      `)
      fs.readFile.resultPerCall = [mockHostFile + '\n']

      await upsert('1.2.3.4', ['hostname1', 'hostname2'])

      expect(write.calls.length).to.equal(0)
    })
  })
}

export default testDoesNothing
