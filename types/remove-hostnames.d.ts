import type { FormatOptions } from './common.ts'

type Options = FormatOptions & {
  filePath?: string
  withIp?: string
}

export default function (hostnames: string[], options?: Options): Promise<void>
