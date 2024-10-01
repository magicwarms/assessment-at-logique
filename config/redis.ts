import Redis from 'ioredis';
import { Config } from "../config";

const redis = new Redis({
    host: Config.REDIS_HOST,
    port: parseInt(Config.REDIS_PORT as string, 10),
    password: Config.REDIS_PASSWORD
});

export default redis;