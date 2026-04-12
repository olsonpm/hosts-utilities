import * as z from 'zod'
import * as fp from './internals/fp-utils.mjs'
import { isHostname, isSpace } from './internals/utils.mjs'
import { isEmpty } from './internals/fp-utils.mjs'
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

const removeHostnames = async (hostnames, options = {}) => {
  const argsObj = { hostnames, options }
  validate(argsObj, getArgsSchema)

  const { filePath = hostsPath, withIp, ...formatOptions } = options
  const parsedLines = await parse({ filePath })

  const ipMatches = withIp ? data => data.ip === withIp : () => true
  const hostnameMatches = fp.containedIn(hostnames)
  const anyHostnameMatches = fp.any(hostnameMatches)
  const dataMatches = data => {
    return ipMatches(data) && anyHostnameMatches(data.hostnamesWithSpace)
  }
  const hasNothingToRemove = fp.compose([
    fp.mapValues(fp.get('data')),
    fp.keepWhen(fp.isLaden),
    fp.none(dataMatches),
  ])
  if (hasNothingToRemove(parsedLines)) {
    return
  }

  const removeMatchingHostnames = fp.discardWhen(hostnameMatches)
  const performRemove = (result, parsed) => {
    if (isEmpty(parsed.data) || !dataMatches(parsed.data)) {
      result.push(parsed)
      return result
    }

    const { hostnamesWithSpace } = parsed.data
    const updatedHostnames = fp.passThrough(hostnamesWithSpace, [
      removeMatchingHostnames,
      trimSpaces,
      removeAdjacentSpaces,
    ])
    if (isEmpty(updatedHostnames)) {
      return result
    }
    result.push({
      ...parsed,
      data: {
        ...parsed.data,
        hostnamesWithSpace: updatedHostnames,
      },
    })
    return result
  }

  const updatedParsedLines = parsedLines.reduce(performRemove, [])

  await write(updatedParsedLines, { filePath, ...formatOptions })
}

function trimSpaces(hostnamesWithSpace) {
  const first = hostnamesWithSpace.findIndex(isHostname)
  if (first === -1) return []

  const last = hostnamesWithSpace.findLastIndex(isHostname)

  return hostnamesWithSpace.slice(first, last + 1)
}

function removeAdjacentSpaces(hostnamesWithSpace) {
  const result = []
  let prevEntry

  for (const hostnameOrSpace of hostnamesWithSpace) {
    // we know the first entry is a hostname
    if (!prevEntry) {
      result.push(hostnameOrSpace)
      prevEntry = hostnameOrSpace
    } else {
      if (isSpace(hostnameOrSpace) && isSpace(prevEntry)) {
        continue
      }

      result.push(hostnameOrSpace)
      prevEntry = hostnameOrSpace
    }
  }

  return result
}

function getArgsSchema() {
  return z.object({
    hostnames: z.array(ipOrHostname()),
    options: partialObject({
      filePath: ladenString(),
      withIp: ipOrHostname(),
      ...sharedSchema.formatOptions(),
    }),
  })
}

export default removeHostnames
