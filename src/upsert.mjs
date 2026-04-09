import * as fp from './internals/fp-utils.mjs'
import { isHostname } from './internals/utils.mjs'
import parse from './parse.mjs'
import write from './write.mjs'

const upsert = async (ip, hostnames, options = {}) => {
  const { upsertComment = fp.returnFirstArg } = options
  const parsedLines = await parse()

  const ipMatches = parsed => parsed.data.ip === ip
  const allHostnamesForIp = fp.passThrough(parsedLines, [
    fp.keepWhen(ipMatches),
    toAllHostnames,
  ])
  const getHostnamesToAdd = fp.discardWhen(fp.containedIn(allHostnamesForIp))
  const hostnamesToAdd = getHostnamesToAdd(hostnames)
  if (fp.isEmpty(hostnamesToAdd)) return

  const hostnamesToAddWithSpace = hostnamesToAdd.flatMap(h => [' ', h])

  // note: below we mutate parsedLines
  const parsedLineToMutate = fp.findLast(ipMatches)(parsedLines)
  if (parsedLineToMutate) {
    if (options.upsertComment) {
      parsedLineToMutate.data.comment ??= ''
    }
    fp.mUpdate({
      comment: prevComment => upsertComment(prevComment),
      hostnamesWithSpace: fp.appendAll(hostnamesToAddWithSpace),
    })(parsedLineToMutate.data)
  } else {
    const appendedEntry = {
      data: {
        ip,
        hostnamesWithSpace: hostnamesToAddWithSpace.slice(1),
      },
    }
    if (options.upsertComment) {
      appendedEntry.data.comment = upsertComment('')
    }
    parsedLines.push(appendedEntry)
  }

  await write(parsedLines)
}

function toAllHostnames(arr) {
  return arr.reduce((allHostnames, parsed) => {
    const parsedHostnames = parsed.data.hostnamesWithSpace.filter(isHostname)
    allHostnames.push(...parsedHostnames)
    return allHostnames
  }, [])
}

export default upsert
