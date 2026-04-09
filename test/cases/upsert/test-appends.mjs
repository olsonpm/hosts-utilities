import { expect } from 'chai'
import { parse, write } from '#test/spies/index'
import upsert from '#src/upsert'

const testAppends = () => {
  context('appends', () => {
    it('appends hostname to an existing ip', async () => {
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
      await upsert('1.2.3.4', ['hostname2'])

      const expectedParsedLines = [
        {
          data: {
            ip: '1.2.3.4',
            hostnamesWithSpace: ['hostname1', ' ', 'hostname2'],
          },
        },
      ]

      expect(write.argsPerCall).to.deep.equal([[expectedParsedLines]])
    })

    it('appends hostname to the last matching ip', async () => {
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
      await upsert('1.2.3.4', ['hostname3'])

      const expectedParsedLines = [
        {
          data: {
            ip: '1.2.3.4',
            hostnamesWithSpace: ['hostname1'],
          },
        },
        {
          data: {
            ip: '1.2.3.4',
            hostnamesWithSpace: ['hostname2', ' ', 'hostname3'],
          },
        },
      ]

      expect(write.argsPerCall).to.deep.equal([[expectedParsedLines]])
    })

    it('appends absent hostnames to the last matching ip', async () => {
      parse.resultPerCall = [
        [
          {
            data: {
              ip: '1.2.3.4',
              hostnamesWithSpace: ['hostname3'],
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
      await upsert('1.2.3.4', ['hostname1', 'hostname3', 'hostname4'])

      const expectedParsedLines = [
        {
          data: {
            ip: '1.2.3.4',
            hostnamesWithSpace: ['hostname3'],
          },
        },
        {
          data: {
            ip: '1.2.3.4',
            hostnamesWithSpace: [
              'hostname2',
              ' ',
              'hostname1',
              ' ',
              'hostname4',
            ],
          },
        },
      ]

      expect(write.argsPerCall).to.deep.equal([[expectedParsedLines]])
    })
  })
}

export default testAppends
