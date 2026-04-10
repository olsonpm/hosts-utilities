import { EOL as eol } from 'node:os'

/**
 * note: this is used to parse hostnamesWithSpace, where it's assumed an element
 *   is either only space, or has no space
 */
const isHostname = str => !isSpace(str)
const isSpace = str => /\s/.test(str)

const isWindows = process.platform === 'win32'

export { eol, isHostname, isSpace, isWindows }
