import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const dataSource = new DataSource({
  url: process.env.DATABASE_URL,
  type: 'postgres',
  entities: [process.env.ENTITIES],
  synchronize: false,
  migrations: [process.env.TYPEORM_MIGRATIONS],
});
