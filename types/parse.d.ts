import type { ParsedLineOutput } from './common.ts'

type Options = {
  filePath?: string
}

export default function (options?: Options): Promise<ParsedLineOutput[]>
