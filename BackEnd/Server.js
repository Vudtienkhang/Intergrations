const app = require("./app.js");
const mysqlConnection = require("./config/mySql.js");
const connectSqlServer = require("./config/sqlServer.js");

mysqlConnection.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối MySQL: ", err);
  } else {
    console.log("Kết nối MySQL thành công");
  }
});

(async () => {
  await connectSqlServer();
  console.log("Kết nối SQL Server thành công");

  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
})();
