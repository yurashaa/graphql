export const AuthTypes = `
    input SignIn {
        email: String
        password: String
    }
    input SignUp {
       username: String
        email: String
        password: String
        file: Upload

    }
    
    extend type Mutation {
      signIn(data: SignIn): String
      signUp(data: SignUp): String 
    }
`
