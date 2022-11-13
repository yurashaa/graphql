import { DataSource } from 'typeorm'
import dotenv from 'dotenv'

import { User } from '../schemas/user'
import { Post } from '../schemas/post'

dotenv.config()

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +(process?.env?.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_NAME,
  entities: [User, Post],
  logging: true,
  synchronize: true
})

console.log(dataSource)
