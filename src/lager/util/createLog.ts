import { Log, LogProps } from "../types"

/**
 * Apply default log props to a provided log object
 * @param {Log} log - The log object to update
 * @param {LogProps} props - The log props object
 * @returns {Log} the resulting log object
 */
export const applyDefaultProps = (log: Log, props?: LogProps): Log => {
  if (props) {
    for (let [propName, prop] of Object.entries(props)) {
      // Apply default props
      if (log[propName] === undefined) {
        if (typeof prop === 'function') {
          log[propName] = prop(log)
        } else {
          log[propName] = prop
        }
      }
    }
  }

  return log
}

/**
 * Initialize a log object with the provided log arguments
 * @param {string} level - the log level 
 * @param {Array<*>} args - the log arguments
 * @param {string} errorKey - The name of the error property to add for an error argument
 * @returns {Log} The new log object 
 */
export const initLog = (level: string, args: Array<any>, errorKey?: string): Log => {
  const log: Log = { level }
  const meta = {
    hasError: false,
    hasMessage: false,
    hasObject: false
  }
  if (!errorKey) {
    errorKey = 'error'
  }

  // Load provided arguemnts into log object
  for (let arg of args) {
    if (arg instanceof Error && !meta.hasError) {
      // Errors are pushed to the errors array
      log[errorKey] = {
        message: arg.message,
        name: arg.name,
        stack: arg.stack
      }
      meta.hasError = true
    } else if (typeof arg === 'object' && !meta.hasObject) {
      // Object values are added to the log object
      Object.assign(log, arg)
      meta.hasObject = true
    } else if (!meta.hasMessage) {
      // Primitive values are passed into the message property
      log.message = arg
      meta.hasMessage = true
    }
  }

  return log
}

/**
 * Create a new log object
 * @param {string} level - The log level 
 * @param {Array<*>} args - The log arguments 
 * @param {LogProps} logProps - The log props to apply to the log 
 * @param {string} errorKey - The name of an error object to use in the log. Defaults to "error" 
 */
export const createLog = (level: string, args: Array<any>, logProps?: LogProps, errorKey?: string): Log => {
  // Initialize the log object with provided aruguments
  const log: Log = initLog(level, args, errorKey)

  // Load default props into log object
  applyDefaultProps(log, logProps)

  return log
}
