type ParsedLineInput = Partial<{
  original: string
  data:
    | Record<any, never>
    | {
        ip: string
        hostnamesWithSpace: string[]
        comment?: string
        space?: Partial<{
          beforeIp: string
          afterIp: string
          beforeComment: string
        }>
      }
}>

type ParsedLineOutput = {
  original: string
  data:
    | Record<any, never>
    | {
        ip: string
        hostnamesWithSpace: string[]
        comment: string
        space: {
          beforeIp: string
          afterIp: string
          beforeComment: string
        }
      }
}

type FormatOptions = Partial<{
  preserveFormatting: boolean
  separatorParts: string
  separatorHostname: string
}>

export type { ParsedLineInput, ParsedLineOutput, FormatOptions }
