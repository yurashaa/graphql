import { Post } from './entity'

export const PostQuery = {
  post: async (parent, args: { id: number }, { dataSource }) => {
    return dataSource.getRepository(Post).findOneBy({ id: args.id })
  },
  posts: async (parent, args, { dataSource }) => {
    return dataSource.getRepository(Post).find({ relations: ['user'] })
  }
}
