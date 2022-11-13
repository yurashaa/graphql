import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation($file: Upload!, $content: String) {
    postCreate(data: { content: $content, file: $file } ) {
      content
      image
    }
  }
`;
