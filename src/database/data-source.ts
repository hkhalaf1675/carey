import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt((process.env.DB_PORT ?? '3306'), 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [process.env.DB_ENTITIES_PATH],
    migrations: [process.env.DB_MIGRATIONS_PATH],
    synchronize: false
}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;