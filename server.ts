import 'dotenv/config'
import app from './app';
import { Config } from "./config";

const port = Config.PORT;

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Handle the unhandled rejection appropriately (e.g., log, restart server)
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('Received SIGTERM signal, shutting down gracefully');
    server.close(() => {
        console.log('REST API server stopped');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('Received SIGINT signal, shutting down gracefully');
    server.close(() => {
        console.log('REST API server stopped');
        process.exit(0);
    });
});