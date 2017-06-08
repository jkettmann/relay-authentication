export default function(func /* , 0..n args */) {
  // eslint-disable-next-line prefer-rest-params
  const args = Array.prototype.slice.call(arguments).splice(1)
  return function() {
    // eslint-disable-next-line prefer-rest-params
    const allArguments = args.concat(Array.prototype.slice.call(arguments))
    return func.apply(this, allArguments)
  }
}
