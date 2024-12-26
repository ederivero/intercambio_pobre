import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { config } from 'dotenv'

config()
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: ['src/models/index.ts'],
  migrations: ['src/migrations/*.ts'],
})
