import * as z from 'zod'
import * as fp from './internals/fp-utils.mjs'
import { isHostname } from './internals/utils.mjs'
import {
  ladenString,
  partialObject,
  sharedSchema,
  validate,
} from './internals/schema-utils.mjs'
import hostsPath from './hosts-path.mjs'
import parse from './parse.mjs'
import write from './write.mjs'

const upsert = async (ip, hostnames, options = {}) => {
  const argsObj = { ip, hostnames, options }
  validate(argsObj, getArgsSchema)

  const {
    filePath = hostsPath,
    upsertComment = fp.returnFirstArg,
    ...formatOptions
  } = options
  const parsedLines = await parse({ filePath })

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

  await write(parsedLines, { filePath, ...formatOptions })
}

function toAllHostnames(arr) {
  return arr.reduce((allHostnames, parsed) => {
    const parsedHostnames = parsed.data.hostnamesWithSpace.filter(isHostname)
    allHostnames.push(...parsedHostnames)
    return allHostnames
  }, [])
}

function getArgsSchema() {
  return z.object({
    ip: ladenString(),
    hostnames: z.array(ladenString()),
    options: partialObject({
      filePath: ladenString(),
      upsertComment: z.function(),
      ...sharedSchema.formatOptions(),
    }),
  })
}

export default upsert
