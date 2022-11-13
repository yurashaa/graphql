import { User } from './entity'

export const UserResolvers = {
  posts: (parent: User, args) => {
    return parent.posts
  }
}
