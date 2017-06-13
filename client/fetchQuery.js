function getOptionsWithFiles(operation, variables, uploadables) {
  // eslint-disable-next-line no-undef
  const body = new FormData()
  body.append('query', operation.text)
  body.append('variables', JSON.stringify(variables))
  Object.keys(uploadables).forEach((filename) => {
    // eslint-disable-next-line no-prototype-builtins
    if (uploadables.hasOwnProperty(filename)) {
      body.append(filename, uploadables[filename])
    }
  })

  return { body }
}

function getOptionsWithoutFiles(operation, variables) {
  const body = JSON.stringify({
    query: operation.text,
    variables,
  })

  const headers = {
    Accept: '*/*',
    'Content-Type': 'application/json',
  }

  return { body, headers }
}

function fetchQuery(operation, variables, cacheConfig, uploadables) {
  const options = uploadables
    ? getOptionsWithFiles(operation, variables, uploadables)
    : getOptionsWithoutFiles(operation, variables)

  // eslint-disable-next-line no-undef
  return fetch('/graphql', {
    method: 'POST',
    credentials: 'same-origin',
    ...options,
  })
    .then(response => response.json())
    .then((data) => {
      if (data.errors) {
        throw data.errors.map(({ message }) => message)
      }
      return data
    })
}

export default fetchQuery
