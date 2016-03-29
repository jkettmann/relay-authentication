console.log('required logger');

global.log = (message) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(message);
  }
}