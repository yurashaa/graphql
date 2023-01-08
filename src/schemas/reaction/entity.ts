import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm'

import { User } from '../user'
import { Post } from '../post'

@Entity('Reaction')
export class Reaction {
  @PrimaryGeneratedColumn()
    id: number

  @CreateDateColumn({ name: 'created_at' })
    createdAt: string

  @Column({ name: 'user_id' })
    userId: number

  @Column({ name: 'post_id' })
    postId: number

  @ManyToOne(() => User, (user) => user.reactions)
  @JoinColumn({ name: 'user_id' })
    user: User

  @ManyToOne(() => Post, (post) => post.reactions)
  @JoinColumn({ name: 'post_id' })
    post: Post
}
