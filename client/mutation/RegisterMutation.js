import { commitMutation, graphql } from 'react-relay'

const mutation = graphql`
  mutation RegisterMutation ($input: RegisterInput!) {
    register(input: $input) {
      user {
        role
      }
    }
  }
`

function commit({
  environment,
  email,
  password,
  firstName,
  lastName,
  role,
  onCompleted,
  onError,
}) {
  const variables = { input: { email, password, firstName, lastName, role } }
  commitMutation(environment, {
    mutation,
    variables,
    onCompleted,
    onError,
  })
}

export default {
  commit,
}
