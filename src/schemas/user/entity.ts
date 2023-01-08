import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BeforeInsert } from 'typeorm'
import bcrypt from 'bcrypt'

import { Post } from '../post'
import { Reaction } from '../reaction'

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

  @BeforeInsert()
  async hashPassword (args): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10)
  }
}
