import { expect } from 'chai'
import { parse, write } from '#test/spies/index'
import { spy } from '#test/utils/index'
import upsert from '#src/upsert'

const testDoesNothing = () => {
  context('does nothing', () => {
    it('does nothing when ip and hostname exists', async () => {
      parse.resultPerCall = [
        [
          {
            data: {
              ip: '1.2.3.4',
              hostnamesWithSpace: ['hostname1'],
            },
          },
        ],
      ]
      const notCalled = spy(() => 'not called')
      await upsert('1.2.3.4', ['hostname1'], { upsertComment: notCalled })

      expect(notCalled.calls.length).to.equal(0)
      expect(write.calls.length).to.equal(0)
    })

    it('does nothing when all hostnames are assigned to the ip - on a single line', async () => {
      parse.resultPerCall = [
        [
          {
            data: {
              ip: '1.2.3.4',
              hostnamesWithSpace: ['hostname1', ' ', 'hostname2'],
            },
          },
        ],
      ]
      await upsert('1.2.3.4', ['hostname1', 'hostname2'])

      expect(write.calls.length).to.equal(0)
    })

    it('does nothing when all hostnames are assigned to the ip - across lines', async () => {
      parse.resultPerCall = [
        [
          {
            data: {
              ip: '1.2.3.4',
              hostnamesWithSpace: ['hostname1'],
            },
          },
          {
            data: {
              ip: '1.2.3.4',
              hostnamesWithSpace: ['hostname2'],
            },
          },
        ],
      ]
      await upsert('1.2.3.4', ['hostname1', 'hostname2'])

      expect(write.calls.length).to.equal(0)
    })
  })
}

export default testDoesNothing
