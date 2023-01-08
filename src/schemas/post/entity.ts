import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm'

import { User } from '../user'
import { Reaction } from '../reaction'

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

  @OneToMany(() => Reaction, (reaction) => reaction.post)
    reactions: Reaction[]
}
