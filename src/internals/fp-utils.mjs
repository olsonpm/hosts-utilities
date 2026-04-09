/**
 * Note: these are simplified utils based on common-fp.  They're copied here to
 *   keep the package small and avoid a dependency
 */

const appendAll = appended => base => base.concat(appended)

const containedIn = arr => {
  const valuesToCheck = new Set(arr)
  return value => valuesToCheck.has(value)
}

const discardWhen = predicate => arr => arr.filter(negate(predicate))

const findLast = predicate => arr => arr.findLast(predicate)

// common-fp uses type-detect to determine types.  We're only using this
// internally, so we can ignore edge cases
const isEmpty = coll => {
  return Array.isArray(coll) ? !coll.length : !Object.keys(coll).length
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

const passThrough = (val, fnArr) =>
  fnArr.reduce((result, fn) => fn(result), val)

const returnFirstArg = arg => arg

const split = separator => str => str.split(separator)

export {
  appendAll,
  containedIn,
  discardWhen,
  findLast,
  isEmpty,
  keepWhen,
  mapValues,
  mUpdate,
  negate,
  passThrough,
  returnFirstArg,
  split,
}
