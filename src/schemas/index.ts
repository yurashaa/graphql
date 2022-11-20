import { gql } from 'apollo-server-express'
import jwt from 'jsonwebtoken'

import { UserTypes, UserResolvers, UserMutation, UserQuery, User } from './user'
import { PostTypes, PostQuery, PostMutation } from './post'
import { AuthMutation, AuthTypes } from './auth'
import { dataSource } from '../db/source'

// remember we only use gql in this file. types in other files are just simple strings
export const typeDefs = gql`
     type Query {
        hello: String
     }
     type Mutation
     ${UserTypes}
     ${PostTypes}
     ${AuthTypes}
`
export const resolvers = {
  Query: {
    hello: () => 'Hello GraphQL',
    ...UserQuery,
    ...PostQuery
  },
  Mutation: {
    ...UserMutation,
    ...PostMutation,
    ...AuthMutation
  },
  User: UserResolvers
}

export const context = ({ req, res }): { userId?: number } => {
  const token = req.headers.authorization || ''

  if (!token) {
    return {}
  }

  const data = jwt.verify(token, process.env.JWT_SECRET)

  return { userId: data.userId }
}
