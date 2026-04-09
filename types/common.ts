type ParsedLine = {
  original: string
  data: {
    ip?: string
    hostnamesWithSpace?: string[]
    comment?: string
    space?: {
      beforeIp: string
      beforeHostnames: string
      beforeComment: string
    }
  }
}

type ParseFile = (filePath: string) => Promise<ParsedLine[]>

type WriteFile = (
  filePath: string,
  parsedLines: ParsedLine[],
  options: WriteOptions
) => Promise<void>

type WriteOptions = {
  preserveFormatting?: boolean
  separatorParts?: string
  separatorHostname?: string
}

export type { ParsedLine, ParseFile, WriteFile, WriteOptions }
