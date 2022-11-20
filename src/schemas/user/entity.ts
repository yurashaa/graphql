import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BeforeInsert } from 'typeorm'
import bcrypt from 'bcrypt'

import { Post } from '../post'

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

  @BeforeInsert()
  async hashPassword (args): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10)
  }
}
