import { ApolloServer } from 'apollo-server-express'
import { expect } from 'chai'
import sinon, { SinonSandbox } from 'sinon'
import { faker } from '@faker-js/faker'

import { resolvers, typeDefs } from '../src/schemas'
import { dataSource } from '../src/db/source'
import { Post } from '../src/schemas/post'
import { Reaction } from '../src/schemas/reaction'

const userId = faker.datatype.number()

describe('Post', () => {
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
      context: () => ({ userId, dataSource })
    })
  })

  after(async () => {
    await server.stop()
  })

  describe('Get post', () => {
    it('should get post by id', async () => {
      const id = faker.datatype.number()

      const query = `
        query($id: Int) {
          post(id: $id) {
            id
            content
          }
        }
      `

      const post = {
        id,
        content: faker.lorem.words()
      } as Post

      const stub = sandbox.stub(dataSource.getRepository(Post), 'findOneBy').resolves(post)

      const response = await server.executeOperation({ query, variables: { id } })

      expect(stub.calledWith({ id })).to.be.ok

      expect(response.errors).to.be.undefined
      expect(response.data?.post).to.deep.equal(post)
    })
  })

  describe('Get posts', () => {
    it('should get posts with counted likes', async () => {
      const query = `
        query {
          posts {
            id
            content
            reactionsCount
          }
        }
      `

      const posts = [{
        id: faker.datatype.number(),
        content: faker.lorem.words(),
        reactions: [{ id: faker.datatype.number() }]
      }, {
        id: faker.datatype.number(),
        content: faker.lorem.words(),
        reactions: [{ id: faker.datatype.number() }]
      }, {
        id: faker.datatype.number(),
        content: faker.lorem.words(),
        reactions: [{ id: faker.datatype.number() }]
      }] as Post[]

      const stub = sandbox.stub(dataSource.getRepository(Post), 'find').resolves(posts)

      posts.reduce((stub, post) => {
        stub.withArgs({ postId: post.id }).resolves(post.reactions.length)
        return stub
      }, sandbox.stub(dataSource.getRepository(Reaction), 'countBy'))

      const response = await server.executeOperation({ query })

      expect(stub.calledWith({ relations: ['user'] })).to.be.ok

      expect(response.errors).to.be.undefined
      expect(response.data?.posts).to.deep.equal(posts.map(post => ({ id: post.id, content: post.content, reactionsCount: post.reactions.length })))
    })
  })

  describe('createPost', () => {
    it('should create post', async () => {
      const content = faker.lorem.words()

      const query = `
        mutation($content: String) {
          postCreate(data: { content: $content }) {
            id
            content
          }
        }
      `

      const post = {
        id: faker.datatype.number(),
        userId,
        content,
        image: ''
      } as Post

      sandbox.stub(dataSource.getRepository(Post), 'save').resolves(post)

      const response = await server.executeOperation({ query, variables: { content } })

      expect(response.errors).to.be.undefined
      expect(response.data.postCreate).to.deep.equal({ id: post.id, content: post.content })
    })
  })

  describe('postCreateReaction', () => {
    it('should add like to post', async () => {
      const postId = faker.datatype.number()

      const query = `
        mutation($postId: Int, $toAdd: Boolean) {
          postCreateReaction(data: { postId: $postId, toAdd: $toAdd }) {
            id
            content
          }
        }
      `

      const post = {
        id: faker.datatype.number(),
        content: faker.lorem.words()
      } as Post

      const stub = sandbox.stub(dataSource.getRepository(Post), 'findOneBy').resolves(post)

      const addReactionStub = sandbox.stub(dataSource.getRepository(Reaction), 'save')

      const response = await server.executeOperation({ query, variables: { postId, toAdd: true } })

      expect(stub.calledWith({ id: postId })).to.be.ok
      expect(addReactionStub.calledOnce).to.be.ok
      expect(addReactionStub.calledWith({ postId, userId }))

      expect(response.errors).to.be.undefined
    })

    it('should remove like from post', async () => {
      const postId = faker.datatype.number()

      const query = `
        mutation($postId: Int, $toAdd: Boolean) {
          postCreateReaction(data: { postId: $postId, toAdd: $toAdd }) {
            id
            content
          }
        }
      `

      const post = {
        id: faker.datatype.number(),
        content: faker.lorem.words()
      } as Post

      const reaction = {
        id: faker.datatype.number(),
        userId,
        postId: post.id
      } as Reaction

      const stub = sandbox.stub(dataSource.getRepository(Post), 'findOneBy').resolves(post)

      const findReactionStub = sandbox.stub(dataSource.getRepository(Reaction), 'findOneBy').resolves(reaction)
      const removeReactionStub = sandbox.stub(dataSource.getRepository(Reaction), 'remove')

      const response = await server.executeOperation({ query, variables: { postId, toAdd: false } })

      expect(stub.calledWith({ id: postId })).to.be.ok
      expect(findReactionStub.calledOnce).to.be.ok
      expect(findReactionStub.calledWith({ postId, userId }))
      expect(removeReactionStub.calledOnce).to.be.ok
      expect(removeReactionStub.calledWith(reaction)).to.be.ok

      expect(response.errors).to.be.undefined
    })
  })
})
