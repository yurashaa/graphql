export const UserTypes = `
    type User {
      id: ID
      username: String
      posts: [Post]
      image: String
      email: String
    }
    
    extend type Query {
      me: User
      user(id: ID): User
      users: [User]
    }
    
    input UserCreateDataInput {
        username: String
        password: String
    }
    input UserUpdateDataInput {
       username: String
    }
    input UserUpdateWhereInput {
       id: ID
    }
    
    extend type Mutation {
      userCreate(data: UserCreateDataInput): User
      userUpdate(data: UserUpdateDataInput, where: UserUpdateWhereInput): User 
    }
`
