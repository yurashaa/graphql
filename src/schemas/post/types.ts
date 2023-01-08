export const PostTypes = `
    type Post {
      id: Int
      content: String
      image: String
      user: User
      reactionsCount: Int
      liked: Boolean
    }
    
    extend type Query {
      post(id: Int): Post
      posts: [Post]
    }
    
    input PostCreateDataInput {
        content: String
        file: Upload
    }
    
    input PostCreateReaction {
        postId: Int
        toAdd: Boolean
    }
    
    extend type Mutation {
      postCreate(data: PostCreateDataInput): Post
      postCreateReaction(data: PostCreateReaction): Post
    }
`
