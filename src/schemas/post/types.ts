export const PostTypes = `
    type Post {
      id: ID
      content: String
      image: String
      user: User
    }
    
    extend type Query {
      post(id: ID): Post
      posts: [Post]
    }
    
    input PostCreateDataInput {
        content: String
        file: Upload!
    }
    
    extend type Mutation {
      postCreate(data: PostCreateDataInput): Post
    }
`
