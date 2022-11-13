import { dataSource } from '../../db/source'
import { User } from './entity'

export const UserMutation = {
  userCreate: async (parent, { data: { username, password } }: { data: { username: string, password: string } }) => {
    const user = new User()

    user.username = username
    user.password = password

    return await dataSource.getRepository(User).save(user)
  },
  userUpdate: (parent, args) => {
    // whatever
  }
}
