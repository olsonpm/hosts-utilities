import mochaHooks from './mocha-hooks.mjs'
import { use as chaiUse } from 'chai'
import chaiDeepMatch from 'chai-deep-match'

chaiUse(chaiDeepMatch)

export { mochaHooks }
