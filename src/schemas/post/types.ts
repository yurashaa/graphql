export const PostTypes = `
    type Post {
      id: ID
      content: String
      image: String
      user: User
      reactionsCount: Int
      liked: Boolean
    }
    
    extend type Query {
      post(id: ID): Post
      posts: [Post]
    }
    
    input PostCreateDataInput {
        content: String
        file: Upload!
    }
    
    input PostCreateReaction {
        postId: ID
        toAdd: Boolean
    }
    
    extend type Mutation {
      postCreate(data: PostCreateDataInput): Post
      postCreateReaction(data: PostCreateReaction): Post
    }
`
