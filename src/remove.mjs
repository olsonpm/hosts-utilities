import * as fp from './internals/fp-utils.mjs'
import { isHostname, isSpace } from './internals/utils.mjs'
import { isEmpty } from './internals/fp-utils.mjs'
import hostsPath from './hosts-path.mjs'
import parse from './parse.mjs'
import write from './write.mjs'

const remove = async (ip, hostnames, options = {}) => {
  const { filePath = hostsPath, ...formatOptions } = options
  const parsedLines = await parse({ filePath })

  const hostnameMatches = fp.containedIn(hostnames)
  const anyHostnameMatches = fp.any(hostnameMatches)
  const dataMatches = data => {
    return data.ip === ip && anyHostnameMatches(data.hostnamesWithSpace)
  }
  const hasNothingToRemove = fp.compose([
    fp.mapValues(fp.get('data')),
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

export default remove
