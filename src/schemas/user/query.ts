import { dataSource } from '../../db/source'
import { User } from './entity'
import { getQueryRelations } from '../../helpers/common'

export const UserQuery = {
  me: async (_, __, ctx) => {
    return await dataSource.getRepository(User).findOne({ where: { id: ctx.userId } })
  },
  user: async (parent, args: { id: number }, _, info) => {
    const relations = getQueryRelations(info.fieldNodes[0])

    return await dataSource.getRepository(User).findOne({ where: { id: args.id }, relations })
  },
  users: async (parent, args) => {
    return await dataSource.getRepository(User).find()
  }
}
