import dedent from 'dedent'
import { expect } from 'chai'
import { fs } from '#test/spies/index'
import { spy } from '#test/utils/index'
import hostsPath from '#src/hosts-path'
import upsert from '#src/upsert'

const testHandlesComments = () => {
  context('handles comments', () => {
    it('keeps existing comments', async () => {
      fs.readFile.resultPerCall = ['1.2.3.4 hostname1 #some comment\n']
      await upsert('1.2.3.4', ['hostname2'])

      const expectedContent = '1.2.3.4 hostname1 hostname2 #some comment\n'

      expect(fs.writeFile.argsPerCall).to.deep.equal([
        [hostsPath, expectedContent],
      ])
    })

    it('inserts comment for a matched entry', async () => {
      fs.readFile.resultPerCall = ['1.2.3.4 hostname1\n']

      const insertSomeComment = spy(() => 'some comment')
      await upsert('1.2.3.4', ['hostname2'], {
        upsertComment: insertSomeComment,
      })

      const expectedContent = '1.2.3.4 hostname1 hostname2\t#some comment\n'
      expect(insertSomeComment.argsPerCall).to.deep.equal([['']])

      expect(fs.writeFile.argsPerCall).to.deep.equal([
        [hostsPath, expectedContent],
      ])
    })

    it('inserts comment for a new entry', async () => {
      fs.readFile.resultPerCall = ['']

      const insertSomeComment = spy(() => 'some comment')
      await upsert('1.2.3.4', ['hostname1'], {
        upsertComment: insertSomeComment,
      })

      expect(insertSomeComment.argsPerCall).to.deep.equal([['']])

      const expectedContent = '1.2.3.4\thostname1\t#some comment\n'
      expect(fs.writeFile.argsPerCall).to.deep.equal([
        [hostsPath, expectedContent],
      ])
    })

    it('updates comment of the last matched ip', async () => {
      const mockHostFile = dedent(`
        1.2.3.4 hostname1 #first comment
        1.2.3.4 hostname2 #second comment
      `)
      fs.readFile.resultPerCall = [mockHostFile + '\n']

      const appendYoyo = spy(fpAppend(' yoyo'))
      await upsert('1.2.3.4', ['hostname3'], { upsertComment: appendYoyo })

      expect(appendYoyo.argsPerCall).to.deep.equal([['#second comment']])

      const expectedContent = dedent(`
        1.2.3.4 hostname1 #first comment
        1.2.3.4 hostname2 hostname3 #second comment yoyo
      `)
      expect(fs.writeFile.argsPerCall).to.deep.equal([
        [hostsPath, expectedContent + '\n'],
      ])
    })
  })
}

function fpAppend(suffix) {
  return str => str + suffix
}

export default testHandlesComments
