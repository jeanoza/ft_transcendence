import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/user/entities/user.entity';

dotenv.config();

console.log(process.env.DB_USERNAME);

const dataSource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: [User],
  migrations: [__dirname + '/src/migrations/*.ts'],
  synchronize: true, //FIXME: at the first time true, then false always
  logging: true,
});

export default dataSource;
