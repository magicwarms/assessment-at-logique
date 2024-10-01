import { DataSource } from 'typeorm';
import { Config } from "../config";

const isProd = Config.NODE_ENV === 'production';

const AppDataSource = new DataSource({
    type: 'postgres',
    host: Config.DB_HOST,
    port: parseInt(Config.DB_PORT as string, 10),
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,
    synchronize: false,
    logging: "all",
    entities: [isProd ? __dirname + '/../models/*.js' : __dirname + '/../models/*.ts'],
    migrations: [isProd ? __dirname + '/migrations/*.js' : __dirname + '/migrations/*.ts'],
});

export default AppDataSource;