import { ApolloServer } from 'apollo-server-express'
import { expect } from 'chai'
import sinon, { SinonSandbox } from 'sinon'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { faker } from '@faker-js/faker'
import { GraphQLError } from 'graphql'

import { context, resolvers, typeDefs } from '../src/schemas'
import { dataSource } from '../src/db/source'
import { User } from '../src/schemas/user'

describe('Auth', () => {
  let server: ApolloServer
  let sandbox: SinonSandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

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

  describe('Sign In', () => {
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

      sandbox.stub(dataSource.getRepository(User), 'findOne').resolves(user)
      sandbox.stub(bcrypt, 'compare').returns(true)
      sandbox.stub(jwt, 'sign').returns(token)

      const response = await server.executeOperation({ query: mutation, variables: { email, password } })

      expect(response.errors).to.be.an('undefined')
      expect(response.data?.signIn).to.eq(token)
    })

    it('should throw error that user with such email does not exist', async () => {
      const email = faker.internet.email()
      const password = faker.internet.password()

      const mutation = `
        mutation($email: String, $password: String) {
          signIn(data: { email: $email, password: $password } )
        }
      `

      sandbox.stub(dataSource.getRepository(User), 'findOne').resolves(null)

      const response = await server.executeOperation({ query: mutation, variables: { email, password } })

      expect(response.errors).to.be.an('array')
      response.errors?.every(error => expect(error).to.be.instanceof(GraphQLError).to.have.property('message', 'Authorization failed'))
    })

    it('should throw error that password is not valid', async () => {
      const email = faker.internet.email()
      const password = faker.internet.password()

      const mutation = `
        mutation($email: String, $password: String) {
          signIn(data: { email: $email, password: $password } )
        }
      `

      const user = { email, password } as User

      sandbox.stub(dataSource.getRepository(User), 'findOne').resolves(user)
      sandbox.stub(bcrypt, 'compare').returns(false)

      const response = await server.executeOperation({ query: mutation, variables: { email, password } })

      expect(response.errors).to.be.an('array')
      response.errors?.every(error => expect(error).to.be.instanceof(GraphQLError).to.have.property('message', 'Authorization failed'))
    })
  })

  describe('Sign Up', () => {
    it('should throw error that user with this email already exist', async () => {
      const email = faker.internet.email()
      const password = faker.internet.password()
      const username = faker.internet.password()

      const mutation = `
        mutation($email: String, $password: String, $username: String) {
          signUp(data: { email: $email, password: $password, username: $username } )
        }
      `

      const existingUser = { email } as User

      sandbox.stub(dataSource.getRepository(User), 'findOne').resolves(existingUser)

      const response = await server.executeOperation({ query: mutation, variables: { email, password, username } })
      expect(response.errors).to.be.an('array')
      response.errors?.every(error => expect(error).to.be.instanceof(GraphQLError).to.have.property('message', 'User with such email or username already exists'))
    })

    it('should create user and return token', async () => {
      const email = faker.internet.email()
      const password = faker.internet.password()
      const username = faker.internet.password()
      const token = faker.datatype.string(30)

      const mutation = `
        mutation($email: String, $password: String, $username: String) {
          signUp(data: { email: $email, password: $password, username: $username } )
        }
      `

      const user = {
        username,
        email,
        password,
        image: ''
      } as User

      sandbox.stub(dataSource.getRepository(User), 'findOne').resolves(null)
      sandbox.stub(dataSource.getRepository(User), 'save').resolves(user)
      sandbox.stub(jwt, 'sign').returns(token)

      const response = await server.executeOperation({ query: mutation, variables: { email, password, username } })

      expect(response.errors).to.be.an('undefined')
      expect(response.data?.signUp).to.eq(token)
    })
  })
})
