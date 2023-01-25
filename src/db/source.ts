import { DataSource } from 'typeorm'
import dotenv from 'dotenv'

import { User } from '../schemas/user'
import { Post } from '../schemas/post'
import { Reaction } from '../schemas/reaction'
import { Hashtag } from '../schemas/hashtag'

dotenv.config()

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT ?? 5000),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_NAME,
  entities: [User, Post, Reaction, Hashtag],
  logging: false,
  synchronize: true
})
