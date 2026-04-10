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

type FormatOptions = {
  preserveFormatting?: boolean
  separatorParts?: string
  separatorHostname?: string
}

export type { ParsedLine, FormatOptions }
