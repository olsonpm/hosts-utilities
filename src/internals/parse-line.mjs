const parseLine = line => {
  const result = {
    original: line,
    data: {},
  }

  const parseLineRe = joinToRegex([
    /^/,
    /(\s*)/, // spaceBeforeIp
    /([^#\s]+)/, // ip
    /(\s+)/, // spaceAfterIp
    /([^#\s][^#]*[^#\s])/, // hostnamesStr
    /(\s*)/, // spaceBeforeComment
    /(#.*)?/, // comment
    /$/,
  ])

  const matches = line.match(parseLineRe)
  if (!matches) return result

  const [
    _full,
    spaceBeforeIp,
    ip,
    spaceAfterIp,
    hostnamesStr,
    spaceBeforeComment,
    comment = '',
  ] = matches

  const hostnamesWithSpace = hostnamesStr.split(/(\s+)/)
  result.data = {
    ip,
    hostnamesWithSpace,
    comment,
    space: {
      beforeIp: spaceBeforeIp,
      afterIp: spaceAfterIp,
      beforeComment: spaceBeforeComment,
    },
  }
  return result
}

function joinToRegex(parts) {
  const fullSource = parts.map(r => r.source).join('')

  return new RegExp(fullSource)
}

export default parseLine
