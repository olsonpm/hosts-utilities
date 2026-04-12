import { isEmpty } from './fp-utils.mjs'
import { getFormatOptions, isHostname } from './utils.mjs'

const toStringLine = (parsedLine, options = {}) => {
  const { preserveFormatting, separatorParts, separatorHostname } =
    getFormatOptions(options)
  const { data = {}, original = '' } = parsedLine

  if (isEmpty(data)) return original

  const { ip, hostnamesWithSpace, comment, space = {} } = data

  if (!preserveFormatting) {
    const hostnames = hostnamesWithSpace.filter(isHostname)
    const parts = [ip, hostnames.join(separatorHostname)]
    if (comment) parts.push(ensureStartsWith('#', comment.trimEnd()))
    return parts.join(separatorParts)
  }

  const parts = [
    space.beforeIp || '',
    ip,
    space.afterIp || separatorParts,
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
