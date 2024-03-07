// import dotenv from 'dotenv';
import mysql from 'mysql';
// import path from 'path';
import dotenv from 'dotenv';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ 
//    path: path.resolve(__dirname, '../../.env') 
// });
dotenv.config();

const config = mysql.createPool({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    
    connectionLimit: 10,
    acquireTimeout: 30000,
    idleTimeoutMillis: 10000
});

config.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
    // console.log('Config', config);
    connection.release();
});

export default config;