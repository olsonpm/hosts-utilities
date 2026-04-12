/**
 * Note: these are simplified utils based on common-fp.  They're copied here to
 *   keep the package small and avoid a dependency
 */

const any = predicate => arr => arr.some(predicate)

const appendAll = appended => base => base.concat(appended)

const assignDefaults = defaults => obj => Object.assign({}, defaults, obj)

const compose = fnArr => val => fnArr.reduce((res, fn) => fn(res), val)

const containedIn = arr => {
  const valuesToCheck = new Set(arr)
  return value => valuesToCheck.has(value)
}

const discardWhen = predicate => arr => arr.filter(negate(predicate))

const ensureStartsWith = prefix => str => {
  return str.startsWith(prefix) ? str : prefix + str
}

const findLast = predicate => arr => arr.findLast(predicate)

const get = key => obj => obj[key]

// common-fp uses type-detect to determine types.  We're only using this
// internally, so we can ignore edge cases
const isEmpty = coll => {
  return Array.isArray(coll) ? !coll.length : !Object.keys(coll).length
}

// "laden" is my positive form of "non-empty"
const isLaden = coll => {
  return Array.isArray(coll) ? !!coll.length : !!Object.keys(coll).length
}

const keepWhen = predicate => arr => arr.filter(predicate)

const mapValues = fn => arr => arr.map(fn)

const mUpdate = mappers => obj => {
  for (const [key, fn] of Object.entries(mappers)) {
    if (!Object.hasOwn(obj, key)) continue

    obj[key] = fn(obj[key], key, obj)
  }
  return obj
}

const negate =
  fn =>
  (...args) =>
    !fn(...args)

const none = predicate => arr => arr.every(negate(predicate))

const passThrough = (val, fnArr) =>
  fnArr.reduce((result, fn) => fn(result), val)

const returnFirstArg = arg => arg

const split = separator => str => str.split(separator)

export {
  any,
  appendAll,
  assignDefaults,
  compose,
  containedIn,
  discardWhen,
  ensureStartsWith,
  findLast,
  get,
  isEmpty,
  isLaden,
  keepWhen,
  mapValues,
  mUpdate,
  negate,
  none,
  passThrough,
  returnFirstArg,
  split,
}
