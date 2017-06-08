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

function commit({ environment, input, onCompleted, onError }) {
  const variables = { input }
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
