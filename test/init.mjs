import mochaHooks from './mocha-hooks.mjs'
import { use as chaiUse } from 'chai'
import chaiDeepMatch from 'chai-deep-match'
import chaiAsPromised from 'chai-as-promised'

chaiUse(chaiDeepMatch)
chaiUse(chaiAsPromised)

export { mochaHooks }
