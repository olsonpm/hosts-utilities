import * as z from 'zod'

const ladenString = () => z.string().min(1)

// strict objects are implied throughout this tool
const partialObject = definition => z.strictObject(definition).partial()

const sharedSchema = {
  formatOptions,
  parsedLines,
}

const space = () => z.string().regex(/^[ \t]*$/)
const ladenSpace = () => z.string().regex(/^[ \t]+$/)
const ipOrHostname = () => z.string().regex(/^[^#\s]+$/)

const validate = (argsObj, getSchema) => {
  const { error, success } = getSchema().safeParse(argsObj)
  if (!success) {
    const prettyMsg = customPrettify(error)
    throw new Error(`Arguments failed the schema\n${prettyMsg}`, {
      cause: error,
    })
  }
}

function formatOptions() {
  return {
    preserveFormatting: z.boolean(),
    separatorParts: ladenSpace(),
    separatorHostname: ladenSpace(),
  }
}

/**
 * note: zod's prettify sorts on path length instead of path
 */
function customPrettify(error) {
  const getStr = el => el.path.join('.') + '_' + el.message
  const byPathThenMessage = (l, r) => getStr(l).localeCompare(getStr(r))

  const lines = []
  const issues = error.issues.toSorted(byPathThenMessage)

  for (const issue of issues) {
    lines.push(`✖ ${issue.message}`)
    lines.push(`  → at ${toDotPath(issue.path)}`)
  }

  return lines.join('\n')
}

/* c8 ignore start */
/**
 * this is copied from zod, no need to test
 */
function toDotPath(_path) {
  const segs = []
  const path = _path.map(seg => (typeof seg === 'object' ? seg.key : seg))
  for (const seg of path) {
    if (typeof seg === 'number') segs.push(`[${seg}]`)
    else if (typeof seg === 'symbol')
      segs.push(`[${JSON.stringify(String(seg))}]`)
    else if (/[^\w$]/.test(seg)) segs.push(`[${JSON.stringify(seg)}]`)
    else {
      if (segs.length) segs.push('.')
      segs.push(seg)
    }
  }

  return segs.join('')
}
/* c8 ignore stop */

function parsedLines() {
  const oneParsedLine = partialObject({
    original: z.string(),
    data: z.union([
      z.strictObject({}),
      z.strictObject({
        ip: ipOrHostname(),
        hostnamesWithSpace: z
          .array(z.union([ipOrHostname(), ladenSpace()]))
          .min(1),
        comment: z.string().optional(),
        space: partialObject({
          beforeIp: space(),
          beforeHostnames: ladenSpace(),
          beforeComment: space(),
        }).optional(),
      }),
    ]),
  })

  return z.array(oneParsedLine)
}

export { ladenSpace, ladenString, partialObject, sharedSchema, space, validate }
