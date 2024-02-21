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
const testConnection = () => {
    pool.query('SELECT 1', (err, results) => {
        if (err) {
            console.error("Failed to connect to database:", err);
            return;
        }
        console.log("Successfully connected to the database");
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
