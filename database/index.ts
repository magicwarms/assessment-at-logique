import AppDataSource from './ormconfig';
import logger from '../logger';

const connectDB = async () => {
    try {
        await AppDataSource.initialize();
        logger.info('Database connected successfully')
    } catch (error) {
        logger.error('Database connection error:', error);
        process.exit(1);
    }
};

export default connectDB;