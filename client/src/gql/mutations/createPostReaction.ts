import { gql } from '@apollo/client';

export const CREATE_POST_REACTION = gql`
  mutation($postId: ID!, $toAdd: Boolean) {
    postCreateReaction(data: { postId: $postId, toAdd: $toAdd } ) {
      reactionsCount
    }
  }
`;
