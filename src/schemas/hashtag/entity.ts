import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable
} from 'typeorm'

import { User } from '../user'
import { Post } from '../post'

@Entity('Hashtag')
export class Hashtag {
  @PrimaryGeneratedColumn()
    id: number

  @CreateDateColumn({ name: 'created_at' })
    createdAt: string

  @Column({ name: 'hashtag' })
    hashtag: string

  @Column({ name: 'user_id' })
    userId: number

  @Column({ name: 'post_id' })
    postId: number

  @ManyToOne(() => User, (user) => user.createdHashtags)
  @JoinColumn({ name: 'user_id' })
    user: User

  @ManyToOne(() => Post, (post) => post.hashtags)
  @JoinColumn({ name: 'post_id' })
    post: Post

  @ManyToMany(() => User, (user) => user.followedHashtags)
  @JoinTable({ name: 'user_hashtag_pivot' })
    followers: User[]
}
