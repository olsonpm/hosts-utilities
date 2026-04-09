type Options = {
  upsertComment?: (prevComment: string) => string
}

export default function (
  ip: string,
  hostnames: string[],
  options: Options
): Promise<void>
