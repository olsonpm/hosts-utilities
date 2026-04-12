import * as z from 'zod'
import * as fp from './internals/fp-utils.mjs'
import { getFormatOptions, isHostname } from './internals/utils.mjs'
import {
  ipOrHostname,
  ladenString,
  partialObject,
  sharedSchema,
  validate,
} from './internals/schema-utils.mjs'
import hostsPath from './hosts-path.mjs'
import parse from './parse.mjs'
import write from './write.mjs'

const assignHostnames = async (ip, hostnames, options = {}) => {
  const argsObj = { ip, hostnames, options }
  validate(argsObj, getArgsSchema)

  const { filePath = hostsPath, ...restOptions } = options
  const formatOptions = getFormatOptions(restOptions)
  const parsedLines = await parse({ filePath })

  const ipMatches = parsed => parsed.data.ip === ip
  const allHostnamesForIp = fp.passThrough(parsedLines, [
    fp.keepWhen(ipMatches),
    toAllHostnames,
  ])
  const getHostnamesToAdd = fp.discardWhen(fp.containedIn(allHostnamesForIp))
  const hostnamesToAdd = getHostnamesToAdd(hostnames)
  if (fp.isEmpty(hostnamesToAdd)) return

  const hostnamesToAddWithSpace = hostnamesToAdd.flatMap(h => [
    formatOptions.separatorHostname,
    h,
  ])

  // note: below we mutate parsedLines
  const parsedLineToMutate = fp.findLast(ipMatches)(parsedLines)
  if (parsedLineToMutate) {
    parsedLineToMutate.data.hostnamesWithSpace.push(...hostnamesToAddWithSpace)
  } else {
    const appendedEntry = {
      data: {
        ip,
        hostnamesWithSpace: hostnamesToAddWithSpace.slice(1),
      },
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
    ip: ipOrHostname(),
    hostnames: z.array(ipOrHostname()),
    options: partialObject({
      filePath: ladenString(),
      ...sharedSchema.formatOptions(),
    }),
  })
}

export default assignHostnames
