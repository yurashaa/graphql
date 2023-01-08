export const ReactionTypes = `
    type Reaction {
      id: ID
      user: User
      post: Post
    }
    
    extend type Query {
      reactions: [Reaction]
    }
    
    input ReactionCreateDataInput {
        postId: ID
    }
    
    extend type Mutation {
      reactionsCreate(data: ReactionCreateDataInput): Reaction
    }
`
