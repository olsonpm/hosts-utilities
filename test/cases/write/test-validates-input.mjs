import { expect } from 'chai'
import dedent from 'dedent'
import write from '#src/write'

const testValidatesInput = () => {
  context('validates input', () => {
    it('validates the arguments', async () => {
      const expectedMsg = dedent(`
        Arguments failed the schema
        ✖ Unrecognized key: "invalid"
          → at options
        ✖ Invalid input: expected string, received number
          → at options.filePath
        ✖ Invalid input: expected boolean, received number
          → at options.preserveFormatting
        ✖ Invalid input: expected string, received number
          → at options.separatorHostname
        ✖ Invalid input: expected string, received number
          → at options.separatorParts
        ✖ Invalid input: expected array, received number
          → at parsedLines
      `)

      const result = write(1, {
        filePath: 3,
        preserveFormatting: 5,
        separatorParts: 6,
        separatorHostname: 7,
        invalid: true,
      })

      await expect(result)
        .to.be.rejectedWith(expectedMsg)
        .and.eventually.have.property('cause')
    })

    it('validates parsedLine data to either be empty or populated', async () => {
      let result = write([{ original: '#some comment', data: {} }])
      await expect(result).to.not.be.rejected

      result = write([
        {
          original: '1.2.3.4 hostname1',
          data: {
            ip: '1.2.3.4',
            hostnamesWithSpace: ['hostname1'],
          },
        },
      ])
      await expect(result).to.not.be.rejected

      result = write([
        {
          original: '1.2.3.4 hostname1',
          data: {
            ip: '1.2.3.4',
          },
        },
      ])

      // note: this isn't a super helpful error, but it works for now
      const expectedMsg = dedent(`
        Arguments failed the schema
        ✖ Invalid input
          → at parsedLines[0].data
      `)

      await expect(result)
        .to.be.rejectedWith(expectedMsg)
        .and.eventually.have.property('cause')
    })

    it('requires hostnamesWithSpace to have at least one entry', async () => {
      const result = write([
        {
          original: '1.2.3.4 hostname1',
          data: {
            ip: '1.2.3.4',
            hostnamesWithSpace: [],
          },
        },
      ])

      // note: this isn't a super helpful error, but it works for now
      const expectedMsg = dedent(`
        Arguments failed the schema
        ✖ Too small: expected array to have >=1 items
          → at parsedLines[0].data.hostnamesWithSpace
      `)

      await expect(result)
        .to.be.rejectedWith(expectedMsg)
        .and.eventually.have.property('cause')
    })

    it('requires hostnamesWithSpace to have either space or hostname entries', async () => {
      let result = write([
        {
          original: '1.2.3.4 hostname1',
          data: {
            ip: '1.2.3.4',
            hostnamesWithSpace: [' ', 'hostname'],
          },
        },
      ])

      await expect(result).to.not.be.rejected

      result = write([
        {
          original: '1.2.3.4 hostname1',
          data: {
            ip: '1.2.3.4',
            hostnamesWithSpace: [' ', 'hostname', 'with spaces'],
          },
        },
      ])

      const expectedMsg = dedent(`
        Arguments failed the schema
        ✖ Invalid input
          → at parsedLines[0].data
      `)

      await expect(result)
        .to.be.rejectedWith(expectedMsg)
        .and.eventually.have.property('cause')

      result = write([
        {
          original: '1.2.3.4 hostname1',
          data: {
            ip: '1.2.3.4',
            hostnamesWithSpace: ['#no-comments'],
          },
        },
      ])

      await expect(result)
        .to.be.rejectedWith(expectedMsg)
        .and.eventually.have.property('cause')
    })
  })
}

export default testValidatesInput
