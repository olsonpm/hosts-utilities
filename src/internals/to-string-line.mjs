import { isEmpty } from './fp-utils.mjs'
import { isHostname } from './utils.mjs'

const toStringLine = (parsedLine, options = {}) => {
  const {
    preserveFormatting = true,
    separatorParts = '\t',
    separatorHostname = ' ',
  } = options
  if (isEmpty(parsedLine.data)) return parsedLine.original

  const { ip, hostnamesWithSpace, comment, space = {} } = parsedLine.data

  if (!preserveFormatting) {
    const hostnames = hostnamesWithSpace.filter(isHostname)
    const parts = [ip, hostnames.join(separatorHostname)]
    if (comment) parts.push(ensureStartsWith('#', comment.trimEnd()))
    return parts.join(separatorParts)
  }

  const parts = [
    space.beforeIp || '',
    ip,
    space.beforeHostnames || separatorParts,
    hostnamesWithSpace.join(''),
  ]

  if (comment) {
    parts.push(
      space.beforeComment || separatorParts,
      ensureStartsWith('#', comment)
    )
  }
  return parts.join('')
}

function ensureStartsWith(char, str) {
  return str.startsWith(char) ? str : char + str
}

export default toStringLine
