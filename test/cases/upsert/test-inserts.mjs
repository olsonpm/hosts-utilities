import { expect } from 'chai'
import { parse, write } from '#test/spies/index'
import upsert from '#src/upsert'

const testInserts = () => {
  context('inserts', () => {
    it('inserts to an empty hostfile', async () => {
      parse.resultPerCall = [[]]
      await upsert('1.2.3.4', ['hostname1'])

      const expectedParsedLines = [
        {
          data: {
            ip: '1.2.3.4',
            hostnamesWithSpace: ['hostname1'],
          },
        },
      ]

      expect(write.argsPerCall).to.deep.equal([[expectedParsedLines]])
    })

    it("inserts when there's no matching ip", async () => {
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
      await upsert('5.6.7.8', ['hostname1'])

      const expectedParsedLines = [
        {
          data: {
            ip: '1.2.3.4',
            hostnamesWithSpace: ['hostname1'],
          },
        },
        {
          data: {
            ip: '5.6.7.8',
            hostnamesWithSpace: ['hostname1'],
          },
        },
      ]

      expect(write.argsPerCall).to.deep.equal([[expectedParsedLines]])
    })
  })
}

export default testInserts
