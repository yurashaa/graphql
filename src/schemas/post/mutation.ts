import * as fs from 'fs'
import { v4 as uuid } from 'uuid'
import { ReadStream } from 'fs'

import { Post } from './entity'
import { dataSource } from '../../db/source'

export const PostMutation = {
  postCreate: async (parent, args: { data: { content: string, file: Promise<any> } }) => {
    const { data: { content, file } } = args

    const { createReadStream, filename } = await file

    const stream: ReadStream = createReadStream()
    const imagePath = `${uuid()}-${filename as string}`
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

    const post = new Post()

    post.userId = 2
    post.content = content
    post.image = imagePath

    return await dataSource.getRepository(Post).save(post)
  }
}
