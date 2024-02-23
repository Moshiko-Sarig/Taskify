import mysql, { Pool, MysqlError } from "mysql";

const pool: Pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectTimeout: 90000,
});


pool.on('connection', (connection) => {
  console.log('DB Connection established');
  connection.on('error', (err: MysqlError | null) => {
    if (err) {
      console.error(new Date(), 'MySQL error', err.code);
    }
  });
  connection.on('close', (err: MysqlError | null) => {
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
    if (connection) connection.release();
    return;
  });
};
testConnection();



async function executeQueryAsync(sqlCmd: string, values: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    pool.query(sqlCmd, values, (err: MysqlError | null, result: any) => {
      if (err) {
        console.error("Database query error:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export { executeQueryAsync };
