import _ from 'lodash';

const strictFullISO8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/

const convertAllDatesInObjectRecursive = <T extends object>(object: T): T => {
  for (const currKey of Object.keys(object)) {
    const currValue = (object as any)[currKey]
    if (currValue && _.isString(currValue) && strictFullISO8601Regex.test(currValue)) {
      (object as any)[currKey] = Date.parse(currValue)
    } else if (_.isPlainObject(currValue)) {
        (object as any)[currKey] = convertAllDatesInObjectRecursive((object as any)[currKey])
    } else if (_.isArray(currValue)) {
      for (let i = 0; i < currValue.length; i++) {
        (object as any)[currKey][i] = convertAllDatesInObjectRecursive((object as any)[currKey][i])
      }
    }
  }
  return object
}



const isJson = (value: string) => {
    try {
        const o = JSON.parse(value)
        if (o && typeof o === 'object') {
            return true
        }
    } catch (e) {
        return false
    }
    return true
}



export { convertAllDatesInObjectRecursive, isJson }
