import { GraphQLError } from 'graphql'

import { dataSource } from '../../db/source'
import { User } from '../user'
import { Hashtag } from './entity'

export const HashtagMutation = {
  createHashtag: async (parent, { data: { hashtag, postId } }: { data: { hashtag: string, postId: number } }, { userId }: { userId: number }) => {
    const newHashtag = new Hashtag()

    newHashtag.hashtag = hashtag
    newHashtag.postId = postId
    newHashtag.userId = userId

    return await dataSource.getRepository(Hashtag).save(newHashtag)
  },
  followHashtag: async (parent, { data: { hashtagId } }: { data: { hashtagId: number } }, { userId }: { userId: number }) => {
    const user = await dataSource.getRepository(User).findOneBy({ id: userId })

    if (!user) {
      throw new GraphQLError('User does not exist')
    }

    const hashtag = await dataSource.getRepository(Hashtag).findOneBy({ id: hashtagId })

    if (!hashtag) {
      throw new GraphQLError('Hashtag does not exist')
    }

    user.followedHashtags = [...(user.followedHashtags || []), hashtag]

    await dataSource.getRepository(User).save(user)

    return hashtag
  }
}
