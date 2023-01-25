import { gql } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
import { DataSource } from 'typeorm'

import { UserTypes, UserResolvers, UserMutation, UserQuery } from './user'
import { PostTypes, PostQuery, PostMutation, PostResolvers } from './post'
import { AuthMutation, AuthTypes } from './auth'
import { ReactionTypes } from './reaction'
import { HashtagTypes, HashtagMutation } from './hashtag'
import { dataSource } from '../db/source'

export const typeDefs = gql`
     type Query {
        hello: String
     }
     type Mutation
     ${UserTypes}
     ${PostTypes}
     ${AuthTypes}
     ${ReactionTypes}
     ${HashtagTypes}
`
export const resolvers = {
  Query: {
    ...UserQuery,
    ...PostQuery
  },
  Mutation: {
    ...UserMutation,
    ...PostMutation,
    ...AuthMutation,
    ...HashtagMutation
  },
  User: UserResolvers,
  Post: PostResolvers
}

export const context = ({ req }): { userId?: number, dataSource: DataSource } => {
  const token = req?.headers?.authorization || ''

  if (!token) {
    return { dataSource }
  }

  const data = jwt.verify(token, process.env.JWT_SECRET)

  return { userId: data.userId, dataSource }
}
