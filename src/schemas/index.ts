import { gql } from 'apollo-server-express'

import { UserTypes, UserResolvers, UserMutation, UserQuery } from './user'
import { PostTypes, PostQuery, PostMutation } from './post'

// remember we only use gql in this file. types in other files are just simple strings
export const typeDefs = gql`
     type Query {
        hello: String
     }
     type Mutation
     ${UserTypes}
     ${PostTypes}
`
export const resolvers = {
  Query: {
    hello: () => 'Hello GraphQL',
    ...UserQuery,
    ...PostQuery
  },
  Mutation: {
    ...UserMutation,
    ...PostMutation
  },
  User: UserResolvers
}
