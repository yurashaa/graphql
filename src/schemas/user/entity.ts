import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BeforeInsert, ManyToMany, JoinTable } from 'typeorm'
import bcrypt from 'bcrypt'

import { Post } from '../post'
import { Reaction } from '../reaction'
import { Hashtag } from '../hashtag'

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    username: string

  @Column({ select: false })
    password: string

  @Column({ nullable: true })
    email: string

  @Column({ select: false, nullable: true })
    token: string

  @Column({ nullable: true })
    image: string

  @OneToMany(() => Post, (post) => post.user)
    posts: Post[]

  @OneToMany(() => Reaction, (reaction) => reaction.user)
    reactions: Reaction[]

  @OneToMany(() => Hashtag, (hashtag) => hashtag.user)
    createdHashtags: Hashtag[]

  @ManyToMany(() => Hashtag, (hashtag) => hashtag.followers)
  @JoinTable({ name: 'user_hashtag_pivot' })
    followedHashtags: Hashtag[]

  @BeforeInsert()
  async hashPassword (args): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10)
  }
}
