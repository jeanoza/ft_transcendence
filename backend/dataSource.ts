import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/user/entities/user.entity';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  //username: process.env.DB_USERNAME,
  //password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User],
  migrations: [__dirname + '/src/migrations/*.ts'],
  synchronize: false, //FIXME: at the first time true, then false always
  logging: true,
});

export default dataSource;
