import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { config } from 'dotenv'

config()
export const AppDataSource = new DataSource({
  type: 'postgres', // Cambia según tu base de datos
  url: process.env.DATABASE_URL,
  synchronize: false, // Usa migraciones, no sincronización automática
  logging: true,
  entities: ['src/models/index.ts'], // Ruta a tus entidades
  migrations: ['src/migrations/*.ts'], // Ruta a tus migraciones
})
