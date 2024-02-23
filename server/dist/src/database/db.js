"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeQueryAsync = void 0;
const mysql_1 = __importDefault(require("mysql"));
const pool = mysql_1.default.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectTimeout: 90000,
});
pool.on('connection', (connection) => {
    console.log('DB Connection established');
    connection.on('error', (err) => {
        if (err) {
            console.error(new Date(), 'MySQL error', err.code);
        }
    });
    connection.on('close', (err) => {
        if (err) {
            console.error(new Date(), 'MySQL close', err.code);
        }
    });
});
const testConnection = async () => {
    pool.getConnection((err, connection) => {
        if (err) {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.error('Database connection was closed.');
            }
            if (err.code === 'ER_CON_COUNT_ERROR') {
                console.error('Database has too many connections.');
            }
            if (err.code === 'ECONNREFUSED') {
                console.error('Database connection was refused.');
            }
        }
        if (connection)
            connection.release();
        return;
    });
};
testConnection();
async function executeQueryAsync(sqlCmd, values = []) {
    return new Promise((resolve, reject) => {
        pool.query(sqlCmd, values, (err, result) => {
            if (err) {
                console.error("Database query error:", err);
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
}
exports.executeQueryAsync = executeQueryAsync;
