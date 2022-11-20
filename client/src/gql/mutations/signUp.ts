import { gql } from '@apollo/client';

export const SIGN_UP = gql`
  mutation($email: String, $password: String, $username: String, $file: Upload) {
    signUp(data: { email: $email, password: $password, username: $username, file: $file } )
  }
`;
