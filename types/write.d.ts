import type { ParsedLine, WriteFile, WriteOptions } from './common.ts'

export default function (
  parsedLines: ParsedLine[],
  options: WriteOptions
): ReturnType<WriteFile>
