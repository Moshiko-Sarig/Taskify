import mysql, {Pool, MysqlError} from "mysql";

const pool: Pool = mysql.createPool({
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
