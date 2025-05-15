

require('dotenv').config();
const sql = require('mssql');

const sqlConfig = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

let sqlPool;

async function connectSQL() {
  if (!sqlPool) {
    sqlPool = await sql.connect(sqlConfig);
    console.log("SQL Server kết nối thành công");
  }
  return sqlPool;
}

module.exports = connectSQL;
