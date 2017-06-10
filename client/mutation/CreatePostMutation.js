import { commitMutation, graphql } from 'react-relay'

const mutation = graphql`
  mutation CreatePostMutation($input: CreatePostInput!) {
    createPost(input: $input) {
      postEdge {
        node {
          id
          title
          description
          image
        }
      }
    }
  }
`

function commit({ environment, input, files, onCompleted, onError }) {
  const variables = { input }
  const uploadables = { image: files.item(0) }

  commitMutation(environment, {
    mutation,
    variables,
    uploadables,
    onCompleted,
    onError,
  })
}
export default {
  commit,
}
