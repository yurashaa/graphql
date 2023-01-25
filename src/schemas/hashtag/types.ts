export const HashtagTypes = `
    type Hashtag {
      id: Int
      user: User
      post: Post
      followers: [User]
      hashtag: String
    }
    
    extend type Query {
      hashtags: [Hashtag]
    }
    
    input HashtagFollowDataInput {
        hashtagId: Int
    }
    
    input CreateHashtagDataInput {
        postId: Int
        hashtag: String
    }
    
    extend type Mutation {
      createHashtag(data: CreateHashtagDataInput): Hashtag 
      followHashtag(data: HashtagFollowDataInput): Hashtag
    }
`
