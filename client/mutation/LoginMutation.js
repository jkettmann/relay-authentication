import { commitMutation, graphql } from 'react-relay'

const mutation = graphql`
  mutation LoginMutation($input: LoginInput!) {
    login(input: $input) {
      user {
        role
        postCount
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
