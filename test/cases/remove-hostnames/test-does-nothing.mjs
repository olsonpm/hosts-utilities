import { expect } from 'chai'
import { fs, write } from '#test/spies/index'
import removeHostnames from '#src/remove-hostnames'

const testDoesNothing = () => {
  context('does nothing', () => {
    it('does nothing with an empty file', async () => {
      fs.readFile.resultPerCall = ['']

      await removeHostnames(['hostname1'])

      expect(write.calls.length).to.equal(0)
    })

    it('does nothing when none of the hostnames exist', async () => {
      fs.readFile.resultPerCall = ['1.2.3.4 hostname1\n']

      await removeHostnames(['hostname2', 'hostname3'])

      expect(write.calls.length).to.equal(0)
    })

    it('does nothing when ip doesnt exist', async () => {
      fs.readFile.resultPerCall = ['1.2.3.4 hostname1\n']

      await removeHostnames(['hostname1'], { withIp: '5.6.7.8' })

      expect(write.calls.length).to.equal(0)
    })
  })
}

export default testDoesNothing
