import { ApolloServer } from 'apollo-server-express'
import { expect } from 'chai'
import sinon, { SinonSandbox } from 'sinon'
import { faker } from '@faker-js/faker'

import { resolvers, typeDefs } from '../src/schemas'
import { dataSource } from '../src/db/source'
import { User } from '../src/schemas/user'
import { Hashtag } from '../src/schemas/hashtag'

const userId = faker.datatype.number()

describe('Hashtag', () => {
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
      context: () => ({ userId })
    })
  })

  after(async () => {
    await server.stop()
  })

  describe('createHashtag', () => {
    it('should create new hashtag', async () => {
      const postId = faker.datatype.number()
      const hashtag = faker.lorem.word()

      const query = `
        mutation($hashtag: String, $postId: Int) {
          createHashtag(data: { hashtag: $hashtag, postId: $postId }) {
             id
             hashtag
          }
        }
      `

      const hashtagEntity = {
        id: faker.datatype.number(),
        hashtag
      } as Hashtag

      sandbox.stub(dataSource.getRepository(Hashtag), 'save').resolves(hashtagEntity)

      const response = await server.executeOperation({ query, variables: { hashtag, postId } })

      expect(response.errors).to.be.undefined
      expect(response.data.createHashtag).to.deep.equal(hashtagEntity)
    })
  })

  describe('followHashtag', () => {
    it('should add hashtag to followed', async () => {
      const hashtagId = faker.datatype.number()

      const user = {
        id: userId,
        followedHashtags: []
      } as User

      const hashtag = {
        id: faker.datatype.number(),
        hashtag: faker.lorem.word()
      } as Hashtag

      const query = `
        mutation($hashtagId: Int) {
          followHashtag(data: { hashtagId: $hashtagId }) {
             id
             hashtag
          }
        }
      `

      const userStub = sandbox.stub(dataSource.getRepository(User), 'findOneBy').resolves(user)
      const userSaveStub = sandbox.stub(dataSource.getRepository(User), 'save').resolves(user)
      const hashtagStub = sandbox.stub(dataSource.getRepository(Hashtag), 'findOneBy').resolves(hashtag)

      const response = await server.executeOperation({ query, variables: { hashtagId } })

      expect(response.errors).to.be.undefined
      expect(userStub.calledWith({ id: userId })).to.be.true
      expect(hashtagStub.calledWith({ id: hashtagId })).to.be.true
      expect(userSaveStub.calledWith({ ...user, followedHashtags: [hashtag] })).to.be.true
      expect(response.data.followHashtag).to.deep.equal(hashtag)
    })

    it('should throw error that hashtag does not exist', async () => {
      const hashtagId = faker.datatype.number()

      const user = {
        id: userId,
        followedHashtags: []
      } as User

      const query = `
        mutation($hashtagId: Int) {
          followHashtag(data: { hashtagId: $hashtagId }) {
             id
             hashtag
          }
        }
      `

      const userStub = sandbox.stub(dataSource.getRepository(User), 'findOneBy').resolves(user)

      sandbox.stub(dataSource.getRepository(Hashtag), 'findOneBy').resolves(null)

      const response = await server.executeOperation({ query, variables: { hashtagId } })

      expect(response.errors).to.not.be.undefined
      expect(userStub.calledWith({ id: userId })).to.be.true
    })
  })
})
