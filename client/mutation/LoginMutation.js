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

function commit({ environment, email, password, onCompleted, onError }) {
  const variables = { input: { email, password } }

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
