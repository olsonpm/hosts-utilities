import type { ParsedLine } from './common.ts'

type Options = {
  filePath?: string
}

export default function (options: Options): Promise<ParsedLine[]>
