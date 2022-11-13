import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm'

import { Post } from '../post'

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    username: string

  @Column({ select: false })
    password: string

  @OneToMany(() => Post, (post) => post.user)
    posts: Post[]
}
