import dotenv from 'dotenv';
import program from '../process.js';

const enviroment = program.opts().mode;
const PORT = program.opts().port;

dotenv.config(
    { path: enviroment === 'prod' ? './src/config/.env' : './src/config/.env.test'}
);

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
}