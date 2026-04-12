import { isWindows } from './internals/utils.mjs'

const hostsPath = isWindows
  ? 'C:\\Windows\\System32\\drivers\\etc\\hosts'
  : '/etc/hosts'

export default hostsPath
