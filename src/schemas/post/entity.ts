import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'

import { User } from '../user'

@Entity('Post')
export class Post {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    content: string

  @Column({ name: 'user_id' })
    userId: number

  @Column({ nullable: true })
    image: string

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
    user: User
}
