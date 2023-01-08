import { DataSource } from 'typeorm'

import { Post } from './entity'
import { Reaction } from '../reaction'

export const PostResolvers = {
  reactionsCount: async (parent: Post, args, { dataSource }: { dataSource: DataSource }) => {
    return await dataSource.getRepository(Reaction).countBy({ postId: parent.id })
  },
  liked: async (parent: Post, args, { dataSource, userId }: { dataSource: DataSource, userId: number }) => {
    return await dataSource.getRepository(Reaction).exist({ where: { postId: parent.id, userId } })
  }
}
