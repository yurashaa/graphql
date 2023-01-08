import { ApolloServer } from 'apollo-server-express'
import { expect } from 'chai'
import sinon from 'sinon'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { faker } from '@faker-js/faker'

import { context, resolvers, typeDefs } from '../src/schemas'
import { dataSource } from '../src/db/source'
import { User } from '../src/schemas/user'

describe('User', () => {
  let server: ApolloServer

  before(() => {
    server = new ApolloServer({
      typeDefs,
      resolvers,
      context
    })
  })

  after(async () => {
    await server.stop()
  })

  describe('Authentication', () => {
    it('should sign in with email and password', async () => {
      const email = faker.internet.email()
      const password = faker.internet.password()
      const token = faker.datatype.string(30)

      const mutation = `
        mutation($email: String, $password: String) {
          signIn(data: { email: $email, password: $password } )
        }
      `

      const user = { email, password } as User

      sinon.stub(dataSource.getRepository(User), 'findOne').resolves(user)
      sinon.stub(bcrypt, 'compare').returns(true)
      sinon.stub(jwt, 'sign').returns(token)

      const response = await server.executeOperation({ query: mutation, variables: { email, password } })

      expect(response.data?.signIn).to.eq(token)
    })
  })
})
