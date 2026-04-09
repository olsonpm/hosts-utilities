import { expect } from 'chai'
import { parse, write } from '#test/spies/index'
import { spy } from '#test/utils/index'
import upsert from '#src/upsert'

const testHandlesComments = () => {
  context('handles comments', () => {
    it('keeps existing comments', async () => {
      parse.resultPerCall = [
        [
          {
            data: {
              ip: '1.2.3.4',
              hostnamesWithSpace: ['hostname1'],
              comment: '#some comment',
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
            comment: '#some comment',
          },
        },
      ]

      expect(write.argsPerCall).to.deep.equal([[expectedParsedLines]])
    })

    it('inserts comment for a matched entry', async () => {
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
      const insertSomeComment = spy(() => 'some comment')
      await upsert('1.2.3.4', ['hostname2'], {
        upsertComment: insertSomeComment,
      })

      const expectedParsedLines = [
        {
          data: {
            ip: '1.2.3.4',
            hostnamesWithSpace: ['hostname1', ' ', 'hostname2'],
            comment: 'some comment',
          },
        },
      ]

      expect(insertSomeComment.argsPerCall).to.deep.equal([['']])

      expect(write.argsPerCall).to.deep.equal([[expectedParsedLines]])
    })

    it('inserts comment for a new entry', async () => {
      parse.resultPerCall = [[]]
      const insertSomeComment = spy(() => 'some comment')
      await upsert('1.2.3.4', ['hostname1'], {
        upsertComment: insertSomeComment,
      })

      const expectedParsedLines = [
        {
          data: {
            ip: '1.2.3.4',
            hostnamesWithSpace: ['hostname1'],
            comment: 'some comment',
          },
        },
      ]

      expect(insertSomeComment.argsPerCall).to.deep.equal([['']])

      expect(write.argsPerCall).to.deep.equal([[expectedParsedLines]])
    })

    it('updates comment of the last matched ip', async () => {
      parse.resultPerCall = [
        [
          {
            data: {
              ip: '1.2.3.4',
              hostnamesWithSpace: ['hostname1'],
              comment: '#first comment',
            },
          },
          {
            data: {
              ip: '1.2.3.4',
              hostnamesWithSpace: ['hostname2'],
              comment: '#second comment',
            },
          },
        ],
      ]
      const appendYoyo = spy(fpAppend(' yoyo'))
      await upsert('1.2.3.4', ['hostname3'], { upsertComment: appendYoyo })

      const expectedParsedLines = [
        {
          data: {
            ip: '1.2.3.4',
            hostnamesWithSpace: ['hostname1'],
            comment: '#first comment',
          },
        },
        {
          data: {
            ip: '1.2.3.4',
            hostnamesWithSpace: ['hostname2', ' ', 'hostname3'],
            comment: '#second comment yoyo',
          },
        },
      ]

      expect(appendYoyo.argsPerCall).to.deep.equal([['#second comment']])

      expect(write.argsPerCall).to.deep.equal([[expectedParsedLines]])
    })
  })
}

function fpAppend(suffix) {
  return str => str + suffix
}

export default testHandlesComments
