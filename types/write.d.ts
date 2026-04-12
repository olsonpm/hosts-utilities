import type { ParsedLineInput, FormatOptions } from './common.ts'

type Options = FormatOptions & {
  filePath?: string
}

export default function (
  parsedLines: ParsedLineInput[],
  options: Options
): Promise<void>
