import { gql } from '@apollo/client';

export const GET_POSTS = gql`
query {
  posts {
    id
    content
    image
    user {
      id
      username
    }
  }
}
`;