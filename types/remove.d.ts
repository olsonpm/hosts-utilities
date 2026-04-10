import type { FormatOptions } from './common.js'

type Options = FormatOptions & {
  filePath?: string
}

export default function (
  ip: string,
  hostnames: string[],
  options: Options
): Promise<void>
