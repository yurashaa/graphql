import { dataSource } from '../../db/source'
import { User } from './entity'

export const UserQuery = {
  me: async (_, __, ctx) => {
    console.log(ctx.userId)
    return await dataSource.getRepository(User).findOne({ where: { id: ctx.userId } })
  },
  user: async (parent, args: { id: number }) => {
    return await dataSource.getRepository(User).findOne({ where: { id: args.id }, relations: ['posts'] })
  },
  users: async (parent, args) => {
    return await dataSource.getRepository(User).find()
  }
}
