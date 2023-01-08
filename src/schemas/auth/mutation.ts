import bcrypt from 'bcrypt'
import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import fs, { ReadStream } from 'fs'

import { User } from '../user'

export const AuthMutation = {
  signIn: async (_, args, { dataSource }) => {
    const { email, password } = args.data

    const user = await dataSource.getRepository(User).findOne({ where: { email }, select: ['id', 'password'] })

    if (!user) {
      throw new GraphQLError('Authorization failed')
    }

    const result = await bcrypt.compare(password, user.password)

    if (!result) {
      throw new GraphQLError('Authorization failed')
    }

    return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '365d' })
  },

  signUp: async (_, args, { dataSource }) => {
    const { data: { email, username, password, file } } = args

    const existingUser = await dataSource.getRepository(User).findOne({ where: [{ email }, { username }] })

    if (existingUser) {
      throw new GraphQLError('User with such email or username already exists')
    }

    let imagePath: string = ''

    if (file) {
      const { createReadStream, filename } = await file

      const stream: ReadStream = createReadStream()
      imagePath = `${uuid()}-${filename as string}`
      const writeStream = fs.createWriteStream(`${process.cwd()}/public/images/${imagePath}`)

      await new Promise((resolve, reject) => {
        stream
          .pipe(writeStream)
          .on('finish', () => {
            resolve(1)
          })
          .on('error', (err) => {
            console.log('Error Event Emitted')
            reject(err)
          })
      })
    }

    const user = await dataSource.getRepository(User).save({
      username,
      email,
      password,
      image: imagePath
    })

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '365d' })

    user.token = token

    await dataSource.getRepository(User).save(user)

    return token
  }
}
