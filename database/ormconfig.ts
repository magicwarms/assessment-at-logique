import { DataSource } from 'typeorm';
import { Config } from "../config";

const AppDataSource = new DataSource({
    type: 'postgres',
    host: Config.DB_HOST,
    port: parseInt(Config.DB_PORT as string, 10),
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,
    synchronize: false,
    logging: "all",
    entities: [__dirname + '/../models/*.ts'],
    migrations: [__dirname + '/migrations/*.ts'],
});

export default AppDataSource;