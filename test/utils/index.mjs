export { default as createMockFn } from './create-mock-fn.mjs'
export { default as spy } from './spy.mjs'

/**
 * this holds an array of the number of characters per index.
 * e.g. spaces[1] is a string of one space, spaces[2] two spaces etc.
 *
 * this is useful for ensuring we're parsing the right thing
 * e.g. if I parse the line `${spaces[1]}some-ip${spaces[2]}some-hostname`
 * then I can assert data.space.beforeIp is one space
 */
const spaces = new Array(6).fill('').map((_, idx) => ' '.repeat(idx))
const tabs = new Array(6).fill('').map((_, idx) => '\t'.repeat(idx))

export { spaces, tabs }
