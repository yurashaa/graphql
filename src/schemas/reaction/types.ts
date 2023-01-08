export const ReactionTypes = `
    type Reaction {
      id: Int
      user: User
      post: Post
    }
    
    extend type Query {
      reactions: [Reaction]
    }
    
    input ReactionCreateDataInput {
        postId: Int
    }
    
    extend type Mutation {
      reactionsCreate(data: ReactionCreateDataInput): Reaction
    }
`
