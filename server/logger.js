console.log('required logger')

global.log = (...args) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...args)
  }
}
