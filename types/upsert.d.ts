import type { FormatOptions } from './common.ts'

type Options = FormatOptions & {
  filePath?: string
  upsertComment?: (prevComment: string) => string
}

export default function (
  ip: string,
  hostnames: string[],
  options: Options
): Promise<void>
