import morgan from 'morgan';
import logger from '../logger'; // Import the Winston logger configuration

const morganMiddleware = morgan('combined', {
    stream: {
        write: (message: string) => logger.info(message.trim()),
    },
});

export default morganMiddleware;
