import * as fs from 'fs'
import { v4 as uuid } from 'uuid'
import { ReadStream } from 'fs'

import { Post } from './entity'
import { DataSource } from 'typeorm'
import { Reaction } from '../reaction'

export const PostMutation = {
  postCreate: async (parent, args: { data: { content: string, file: any } }, { dataSource, userId }: { dataSource: DataSource, userId: number }) => {
    const { data: { content, file } } = args

    let imagePath = ''

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

    const post = new Post()

    post.userId = userId
    post.content = content
    post.image = imagePath

    return await dataSource.getRepository(Post).save(post)
  },

  postCreateReaction: async (parent, args: { data: { postId: number, toAdd: boolean } }, { dataSource, userId }: { dataSource: DataSource, userId: number }) => {
    const { data: { postId, toAdd } } = args

    const post = await dataSource.getRepository(Post).findOneBy({ id: postId })

    if (!post) {
      throw new Error('Post does not exist')
    }

    if (toAdd) {
      const reaction = new Reaction()

      reaction.userId = userId
      reaction.postId = postId

      await dataSource.getRepository(Reaction).save(reaction)
    } else {
      const reaction = await dataSource.getRepository(Reaction).findOneBy({ postId, userId })

      if (!reaction) {
        throw new Error('Reaction does not exist')
      }

      await dataSource.getRepository(Reaction).remove(reaction)
    }
  }
}
