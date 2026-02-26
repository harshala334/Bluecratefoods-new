import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  ssl: process.env.DB_SSL === 'require' ? { rejectUnauthorized: false } : false,
});
