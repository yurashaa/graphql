import { dataSource } from '../../db/source'
import { Post } from './entity'

export const PostQuery = {
  post: async (parent, args: { id: number }) => {
    return await dataSource.getRepository(Post).findOneBy({ id: args.id })
  },
  posts: async (parent, args) => {
    return await dataSource.getRepository(Post).find({ relations: ['user'] })
  }
}
