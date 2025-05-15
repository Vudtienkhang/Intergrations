const mysqlConnection = require("../config/mySql.js");
const connectSQL = require("../config/sqlServer.js");
const sql = require("mssql");

exports.login = (req, res) => {
  const { username, password } = req.body;

  const query = `
    SELECT AccountID, Username, RoleID, EmployeeID, Password FROM account WHERE Username = ?
  `;

  mysqlConnection.query(query, [username], (err, results) => {
    if (err)
      return res.status(500).json({ message: "Lỗi máy chủ.", error: err });
    if (results.length === 0)
      return res.status(404).json({ message: "Tài khoản không tồn tại." });

    const user = results[0];

    if (password !== user.Password)
      return res.status(401).json({ message: "Mật khẩu không đúng." });

    res.status(200).json({
      message: "Đăng nhập thành công.",
      id: user.EmployeeID,
      role: user.RoleID,
      username: user.Username,
    });
  });
};

exports.getRole = (req, res) => {
  const query = `SELECT * FROM role`;
  mysqlConnection.query(query, (err, result) => {
    if (err) {
      console.error("Lỗi khi lấy vai trò: ", err);
      return res.status(500).json({ message: "Lỗi server" });
    }
    res.status(200).json(result);
  });
};

exports.getAllEmployees = async (req, res) => {
  try {
    const pool = await connectSQL();
    const result = await pool.request().query(`
      SELECT 
        e.EmployeeID,
        e.FullName,
        e.Gender,
        e.DateOfBirth,
        e.PhoneNumber,
        e.Email,
        e.HireDate,
        e.Img_url,
        e.Status,
        d.DepartmentName,
        p.PositionName
      FROM Employees e
      LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID
      LEFT JOIN Positions p ON e.PositionID = p.PositionID
    `);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("🔥 Lỗi khi lấy danh sách nhân viên:", err);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách nhân viên.",
      error: err.message,
    });
  }
};

exports.getAllDepartments = (req, res) => {
  const query = `SELECT * FROM departments`;

  mysqlConnection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Lỗi khi lấy danh sách phòng ban.",
        error: err.message,
      });
    }
    res.status(200).json(results);
  });
};


exports.getAllPositions = (req, res) => {
  const query = `SELECT * FROM positions`;

  mysqlConnection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Lỗi khi lấy danh sách chức vụ.",
        error: err.message,
      });
    }
    res.status(200).json(results);
  });
};

exports.addEmployee = async (req, res) => {
  const newEmployee = req.body;
  try {
    const pool = await connectSQL();

    let imgUrl = newEmployee.Img_url || null;

    const result = await pool
      .request()
      .input("FullName", sql.NVarChar, newEmployee.FullName)
      .input("Gender", sql.NVarChar, newEmployee.Gender)
      .input("DateOfBirth", sql.Date, new Date(newEmployee.DateOfBirth))
      .input("PhoneNumber", sql.VarChar, newEmployee.PhoneNumber)
      .input("Email", sql.VarChar, newEmployee.Email)
      .input("HireDate", sql.Date, new Date(newEmployee.HireDate))
      .input("Img_url", sql.VarChar, imgUrl)
      .input("DepartmentID", sql.Int, newEmployee.DepartmentID)
      .input("PositionID", sql.Int, newEmployee.PositionID).query(`
        INSERT INTO Employees (
          FullName, Gender, DateOfBirth, PhoneNumber, Email,
          HireDate, Img_url, DepartmentID, PositionID
        )
        OUTPUT INSERTED.EmployeeID
        VALUES (
          @FullName, @Gender, @DateOfBirth, @PhoneNumber, @Email,
          @HireDate, @Img_url, @DepartmentID, @PositionID
        )
      `);

    const employeeID = result.recordset[0].EmployeeID;
    console.log("Đã thêm vào SQL Server với ID:", employeeID);

    const mysqlResult = await mysqlConnection.execute(
      `
      INSERT INTO Employees (EmployeeID, FullName, DepartmentID, PositionID)
      VALUES (?, ?, ?, ?)
    `,
      [
        employeeID,
        newEmployee.FullName,
        newEmployee.DepartmentID,
        newEmployee.PositionID,
      ]
    );
    res.status(201).json({
      message: "Thêm nhân viên thành công.",
      employeeID: employeeID,
    });
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({
      message: "Lỗi khi thêm nhân viên: " + (err.message || "Không xác định"),
      error: err,
    });
  }
};

// lấy tên nhân viên thực hiện thêm lương
exports.getEmployees = (req, res) => {
  const query = `
    SELECT EmployeeID, FullName FROM Employees
  `;

  mysqlConnection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi máy chủ.", error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Không có nhân viên nào." });
    }

    res.status(200).json({
      message: "Danh sách nhân viên.",
      employees: results,
    });
  });
};

exports.addSalary = (req, res) => {
  const { EmployeeID, BaseSalary, Bonus, Deductions, NetSalary, SalaryMonth } =
    req.body;

  if (
    !EmployeeID ||
    !BaseSalary ||
    !Bonus ||
    !Deductions ||
    !NetSalary ||
    !SalaryMonth
  ) {
    return res
      .status(400)
      .json({ message: "Thiếu thông tin lương nhân viên." });
  }

  const query = `
    INSERT INTO salaries (EmployeeID, SalaryMonth, BaseSalary, Bonus, Deductions, NetSalary)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    EmployeeID,
    SalaryMonth,
    BaseSalary,
    Bonus,
    Deductions,
    NetSalary,
  ];

  mysqlConnection.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi máy chủ.", error: err });
    }

    res.status(201).json({
      message: "Thêm thông tin lương thành công.",
      salaryID: results.insertId,
      EmployeeID,
      SalaryMonth,
      BaseSalary,
      Bonus,
      Deductions,
      NetSalary,
    });
  });
};

// xoá lương nhân viên
exports.deleteSalary = (req, res) => {
  const salaryID = req.params.salaryID;

  const sql = "DELETE FROM salaries WHERE SalaryID = ?";

  mysqlConnection.query(sql, [salaryID], (err, result) => {
    if (err) {
      console.error("Lỗi khi xóa lương:", err);
      return res.status(500).json({ error: "Lỗi server khi xóa lương" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy lương để xóa" });
    }

    return res.json({ message: "Xóa lương thành công" });
  });
};

// update lương nhân viên
exports.updateSalary = (req, res) => {
  const salaryID = req.params.salaryID;
  const { BaseSalary, Bonus, Deductions } = req.body;

  const sql =
    "UPDATE salaries SET BaseSalary = ?, Bonus = ?, Deductions = ? WHERE SalaryID = ?";
  mysqlConnection.query(
    sql,
    [BaseSalary, Bonus, Deductions, salaryID],
    (err, result) => {
      if (err) {
        console.error("Lỗi khi cập nhật lương:", err);
        return res.status(500).json({ error: "Lỗi server khi cập nhật lương" });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy bản ghi để cập nhật" });
      }

      return res.json({ message: "Cập nhật lương thành công" });
    }
  );
};

// Lấy thông tin chi tiết của nhân viên theo EmployeeID từ SQL Server
exports.getEmployeeById = async (req, res) => {
  const { EmployeeID } = req.params;

  const employeeIdNumber = parseInt(EmployeeID, 10);

  if (isNaN(employeeIdNumber)) {
    return res.status(400).json({ message: "EmployeeID không hợp lệ." });
  }

  try {
    const pool = await connectSQL();
    const result = await pool
      .request()
      .input("EmployeeID", sql.Int, employeeIdNumber).query(`
        SELECT 
          e.EmployeeID,
          e.FullName,
          e.Gender,
          e.DateOfBirth,
          e.PhoneNumber,
          e.Email,
          e.HireDate,
          e.Img_url,
          e.DepartmentID,
          e.PositionID,
          d.DepartmentName,
          p.PositionName,
          e.Status
        FROM Employees e
        LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID
        LEFT JOIN Positions p ON e.PositionID = p.PositionID
        WHERE e.EmployeeID = @EmployeeID
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên." });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("🔥 Lỗi khi lấy thông tin nhân viên:", err);
    res.status(500).json({
      message: "Lỗi khi lấy thông tin nhân viên.",
      error: err.message,
    });
  }
};
// cập nhật nhân viên
exports.updateEmployee = async (req, res) => {
  const employeeID = req.params.EmployeeID;
  const updatedEmployee = req.body;

  try {
    const pool = await connectSQL();

    let imgUrl = updatedEmployee.Img_url || null;

    const dob = new Date(updatedEmployee.DateOfBirth);
    const hireDate = new Date(updatedEmployee.HireDate);

    if (isNaN(dob.getTime()) || isNaN(hireDate.getTime())) {
      return res.status(400).json({
        message: "Ngày sinh hoặc ngày vào làm không hợp lệ.",
      });
    }

    const result = await pool
      .request()
      .input("EmployeeID", sql.Int, employeeID)
      .input("FullName", sql.NVarChar, updatedEmployee.FullName)
      .input("Gender", sql.NVarChar, updatedEmployee.Gender)
      .input("DateOfBirth", sql.Date, dob)
      .input("PhoneNumber", sql.VarChar, updatedEmployee.PhoneNumber)
      .input("Email", sql.VarChar, updatedEmployee.Email)
      .input("HireDate", sql.Date, hireDate)
      .input("Img_url", sql.NVarChar(sql.MAX), imgUrl)
      .input("DepartmentID", sql.Int, updatedEmployee.DepartmentID)
      .input("PositionID", sql.Int, updatedEmployee.PositionID)
      .input("Status", sql.NVarChar, updatedEmployee.Status || null).query(`
        UPDATE Employees SET
          FullName = @FullName,
          Gender = @Gender,
          DateOfBirth = @DateOfBirth,
          PhoneNumber = @PhoneNumber,
          Email = @Email,
          HireDate = @HireDate,
          Img_url = @Img_url,
          DepartmentID = @DepartmentID,
          PositionID = @PositionID,
          Status = @Status
        WHERE EmployeeID = @EmployeeID
      `);

    const mysqlResult = await mysqlConnection.execute(
      `UPDATE Employees SET FullName = ?, DepartmentID = ?, PositionID = ? WHERE EmployeeID = ?`,
      [
        updatedEmployee.FullName,
        updatedEmployee.DepartmentID,
        updatedEmployee.PositionID,
        employeeID,
      ]
    );

    res.status(200).json({
      employeeID: employeeID,
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật:", err);
    res.status(500).json({
      message:
        "Lỗi khi cập nhật nhân viên: " + (err.message || "Không xác định"),
      error: err,
    });
  }
};

exports.updateMyProfile = async (req, res) => {
  const employeeID = req.params.EmployeeID;

  const updatedEmployee = req.body;

  try {
    const pool = await connectSQL();

    const FullName = updatedEmployee.FullName ?? null;
    const Gender = updatedEmployee.Gender ?? null;
    const PhoneNumber = updatedEmployee.PhoneNumber ?? null;
    const Email = updatedEmployee.Email ?? null;
    const Img_url = updatedEmployee.Img_url ?? null;

    let dob = null;
    if (updatedEmployee.DateOfBirth) {
      dob = new Date(updatedEmployee.DateOfBirth);
      if (isNaN(dob.getTime())) {
        return res.status(400).json({ message: "Ngày sinh không hợp lệ." });
      }
    }

    // Update MSSQL
    await pool
      .request()
      .input("EmployeeID", sql.Int, employeeID)
      .input("FullName", sql.NVarChar, FullName)
      .input("Gender", sql.NVarChar, Gender)
      .input("DateOfBirth", sql.Date, dob)
      .input("PhoneNumber", sql.VarChar, PhoneNumber)
      .input("Email", sql.VarChar, Email)
      .input("Img_url", sql.NVarChar(sql.MAX), Img_url).query(`
        UPDATE Employees SET
          FullName = COALESCE(@FullName, FullName),
          Gender = COALESCE(@Gender, Gender),
          DateOfBirth = COALESCE(@DateOfBirth, DateOfBirth),
          PhoneNumber = COALESCE(@PhoneNumber, PhoneNumber),
          Email = COALESCE(@Email, Email),
          Img_url = COALESCE(@Img_url, Img_url)
        WHERE EmployeeID = @EmployeeID
      `);

    // Update MySQL chỉ FullName thôi
    await mysqlConnection.execute(
      `UPDATE Employees SET FullName = ? WHERE EmployeeID = ?`,
      [FullName, employeeID]
    );

    res.status(200).json({ message: "Cập nhật thông tin cá nhân thành công." });
  } catch (err) {
    console.error("Lỗi khi cập nhật thông tin cá nhân:", err);
    res.status(500).json({
      message:
        "Lỗi khi cập nhật thông tin cá nhân: " +
        (err.message || "Không xác định"),
      error: err,
    });
  }
};

// Xoá nhân viên khỏi cả SQL Server và MySQL
exports.deleteEmployee = async (req, res) => {
  const { EmployeeID } = req.params;

  try {
    const pool = await connectSQL();

    await pool.request().input("EmployeeID", sql.Int, EmployeeID).query(`
        DELETE FROM Employees WHERE EmployeeID = @EmployeeID
      `);

    const deleteQuery = `DELETE FROM Employees WHERE EmployeeID = ?`;
    const deteleAccount = `DELETE FROM account WHERE EmployeeID = ?`;
    await mysqlConnection.execute(deteleAccount, [EmployeeID]);
    await mysqlConnection.execute(deleteQuery, [EmployeeID]);

    res
      .status(200)
      .json({ message: "Xoá nhân viên thành công ở cả SQL Server và MySQL." });
  } catch (err) {
    console.error("🔥 Lỗi khi xoá nhân viên:", err);
    res.status(500).json({
      message: "Lỗi khi xoá nhân viên.",
      error: err.message,
    });
  }
};

// lấy tổng nhân viên từ mySql
exports.gettotalEmployees = (req, res) => {
  const query = `SELECT COUNT(*) AS totalEmployees FROM employees`;
  mysqlConnection.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi lấy dữ liệu" });
    }
    res.status(200).json(result[0]);
  });
};

// lấy tổng phòng ban từ mySql
exports.gettotalDepartment = (req, res) => {
  const query = `SELECT COUNT(*) AS totalDepartment FROM departments`;
  mysqlConnection.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi lấy dữ liệu" });
    }
    res.status(200).json(result[0]);
  });
};

// lấy tổng lương từ mySql
exports.gettotalSalary = (req, res) => {
  const query = `SELECT 
    SUM(NetSalary) AS totalSalary, 
    MONTH(CURDATE()) AS currentMonth
    FROM 
    salaries
    WHERE 
    MONTH(SalaryMonth) = MONTH(CURDATE())
    AND YEAR(SalaryMonth) = YEAR(CURDATE());
`;
  mysqlConnection.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi lấy dữ liệu" });
    }
    res.status(200).json(result[0]);
  });
};

// Lấy thông tin lương từ MySQL
exports.getsalaries = (req, res) => {
  const query = `
    SELECT s.*, e.FullName
    FROM salaries s
    JOIN employees e ON s.EmployeeID = e.EmployeeID
  `;

  mysqlConnection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }

    res.status(200).json(results);
  });
};

//lấy danh sách phong ban từ SQL
exports.getAllDepartmentsSql = async (req, res) => {
  try {
    const pool = await connectSQL();
    const result = await pool.request().query(`
      SELECT 
        d.DepartmentID,
        d.DepartmentName,
        COUNT(e.EmployeeID) as employeeCount
      FROM Departments d
      LEFT JOIN Employees e ON d.DepartmentID = e.DepartmentID
      GROUP BY d.DepartmentID, d.DepartmentName
    `);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Lỗi khi lấy dữ liệu!!", err);
    return res.status(500).json({ message: "Không lấy dữ liệu." });
  }
};
// lấy possition từ SQLserver
exports.getAllPositionSql = async (req, res) => {
  try {
    const pool = await connectSQL();
    const result = await pool.request().query(`
      SELECT 
        p.PositionID,
        p.PositionName,
        p.Description,
        p.MinSalary,
        p.MaxSalary
      FROM Positions p
    `);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Lỗi khi lấy dữ liệu!!", err);
    return res.status(500).json({ message: "Không lấy dữ liệu." });
  }
};
// Cập nhật Position ở hai csdl
exports.updatePosition = async (req, res) => {
  const { PositionID } = req.params;
  const { PositionName, MinSalary, MaxSalary, Description } = req.body;

  if (
    !PositionID ||
    !PositionName ||
    MinSalary == null ||
    MaxSalary == null ||
    !Description
  ) {
    return res.status(400).json({ error: "Thiếu dữ liệu đầu vào" });
  }

  try {
    const poolSQL = await connectSQL();
    const mysqlPool = mysqlConnection;

    const transaction = new sql.Transaction(poolSQL);
    await transaction.begin();

    try {
      // Cập nhật SQL Server
      await transaction
        .request()
        .input("PositionID", sql.Int, PositionID)
        .input("PositionName", sql.NVarChar(100), PositionName)
        .input("MinSalary", sql.Int, MinSalary)
        .input("MaxSalary", sql.Int, MaxSalary)
        .input("Description", sql.NVarChar(sql.MAX), Description).query(`
          UPDATE Positions 
          SET PositionName = @PositionName, MinSalary = @MinSalary, MaxSalary = @MaxSalary, Description = @Description
          WHERE PositionID = @PositionID
        `);

      // Cập nhật MySQL
      await new Promise((resolve, reject) => {
        mysqlPool.query(
          `UPDATE positions 
           SET PositionName = ?, MinSalary = ?, MaxSalary = ?, Description = ? 
           WHERE PositionID = ?`,
          [PositionName, MinSalary, MaxSalary, Description, PositionID],
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          }
        );
      });

      await transaction.commit();
      res.status(200).json({ message: "Cập nhật chức danh thành công!" });
    } catch (err) {
      await transaction.rollback();
      console.error("Lỗi khi cập nhật chức danh:", err);
      res.status(500).json({ error: "Lỗi khi cập nhật chức danh" });
    }
  } catch (err) {
    console.error("Lỗi kết nối CSDL:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Xoá Position ở hai csdl
exports.deletePosition = async (req, res) => {
  const { PositionID } = req.params;

  if (!PositionID) {
    return res.status(400).json({ error: "Thiếu PositionID" });
  }

  try {
    const poolSQL = await connectSQL();
    const mysqlPool = mysqlConnection;

    const transaction = new sql.Transaction(poolSQL);
    await transaction.begin();

    try {
      // Xoá trong SQL Server
      await transaction
        .request()
        .input("PositionID", sql.Int, PositionID)
        .query(`DELETE FROM Positions WHERE PositionID = @PositionID`);

      // Xoá trong MySQL
      await new Promise((resolve, reject) => {
        mysqlPool.query(
          `DELETE FROM positions WHERE PositionID = ?`,
          [PositionID],
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          }
        );
      });

      await transaction.commit();
      res.status(200).json({ message: "Xoá chức danh thành công!" });
    } catch (err) {
      await transaction.rollback();
      console.error("Lỗi khi xoá chức danh:", err);
      res.status(500).json({ error: "Lỗi khi xoá chức danh" });
    }
  } catch (err) {
    console.error("Lỗi kết nối CSDL:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// thêm Position ở cả hai Csdl
exports.addPosition = async (req, res) => {
  const { PositionName, MinSalary, MaxSalary, Description } = req.body;

  if (!PositionName || MinSalary == null || MaxSalary == null || !Description) {
    return res.status(400).json({ error: "Thiếu dữ liệu đầu vào" });
  }

  const poolSQL = await connectSQL();
  const mysqlPool = mysqlConnection;

  const transaction = new sql.Transaction(poolSQL);

  try {
    await transaction.begin();

    try {
      const mssqlRequest = transaction.request();
      await mssqlRequest
        .input("PositionName", sql.NVarChar(100), PositionName)
        .input("MinSalary", sql.Int, MinSalary)
        .input("MaxSalary", sql.Int, MaxSalary)
        .input("Description", sql.NVarChar(sql.MAX), Description).query(`
          INSERT INTO Positions (PositionName, MinSalary, MaxSalary, Description)
          VALUES (@PositionName, @MinSalary, @MaxSalary, @Description)
        `);

      await new Promise((resolve, reject) => {
        mysqlPool.query(
          `INSERT INTO positions (PositionName, MinSalary, MaxSalary, Description)
           VALUES (?, ?, ?, ?)`,
          [PositionName, MinSalary, MaxSalary, Description],
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          }
        );
      });

      await transaction.commit();
      res.status(201).json({ message: "Thêm chức danh thành công!" });
    } catch (err) {
      await transaction.rollback();
      console.error("Lỗi khi thêm chức danh:", err);
      res.status(500).json({ error: "Lỗi khi thêm chức danh" });
    }
  } catch (err) {
    console.error("Lỗi kết nối CSDL:", err);
    res.status(500).json({ error: "Lỗi kết nối CSDL" });
  }
};

// lấy dữ liệu department từ HUman
exports.getDepartments = async (req, res) => {
  try {
    const departmentID = req.params.DepartmentID;
    if (!departmentID) {
      return res.status(400).json({ error: "Thiếu DepartmentID" });
    }
    const pool = await connectSQL();
    const result = await pool
      .request()
      .input("departmentId", sql.Int, parseInt(departmentID.trim()))
      .query(
        `SELECT e.EmployeeID, e.FullName, e.Email FROM Departments d JOIN Employees e ON d.DepartmentID = e.DepartmentID WHERE d.DepartmentID = @departmentID `
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Lỗi truy vấn nhân viên theo phòng ban:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};
// xoá dữ liệu department cả 2 csdl
exports.deleteDepartment = async (req, res) => {
  const departmentID = req.params.DepartmentID;
  if (!departmentID) {
    return res.status(400).json({ error: "Thiếu DepartmentID" });
  }

  try {
    const poolSQLServer = await connectSQL();
    const mysqlPool = mysqlConnection;

    const transaction = new sql.Transaction(poolSQLServer);
    await transaction.begin();

    try {
      await transaction
        .request()
        .input("DepartmentID", sql.Int, departmentID)
        .query("DELETE FROM Departments WHERE DepartmentID = @DepartmentID");

      await new Promise((resolve, reject) => {
        mysqlPool.query(
          "DELETE FROM departments WHERE DepartmentID = ?",
          [departmentID],
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          }
        );
      });

      await transaction.commit();
      res.status(200).json({ message: "Xoá phòng ban thành công!" });
    } catch (err) {
      await transaction.rollback();
      console.error("Lỗi khi xoá phòng ban:", err);
      res.status(500).json({ error: "Lỗi khi xoá phòng ban" });
    }
  } catch (err) {
    console.error("Lỗi kết nối tới cơ sở dữ liệu:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

//Biểu đồ hiển thị tông lương
exports.getMonthlySalaryReport = async (req, res) => {
  try {
    const [rows] = await mysqlConnection.promise().query(`
      SELECT 
        DATE_FORMAT(SalaryMonth, '%Y-%m') AS Month,
        SUM(NetSalary) AS TotalSalary
      FROM salaries
      GROUP BY DATE_FORMAT(SalaryMonth, '%Y-%m')
      ORDER BY Month;
    `);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Lỗi lấy dữ liệu lương:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// thông báo
exports.getNotifications = async (req, res) => {
  try {
    const poolSQLServer = await connectSQL();

    const sqlQuery = `
      SELECT EmployeeID, FullName, DateOfBirth, HireDate
      FROM Employees
    `;
    const sqlResults = await poolSQLServer.request().query(sqlQuery);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    const allNotifications = [];

    sqlResults.recordset.forEach((row) => {
      const birthday = new Date(row.DateOfBirth);
      const birthdayMonth = birthday.getMonth();
      const birthdayDay = birthday.getDate();

      if (birthdayMonth === currentMonth && birthdayDay === currentDay) {
        allNotifications.push({
          type: "Sinh nhật",
          message: `${row.FullName} có sinh nhật hôm nay!`,
          date: row.DateOfBirth,
        });
      }

      if (birthdayMonth === currentMonth && birthdayDay >= currentDay) {
        allNotifications.push({
          type: "Sinh nhật",
          message: `${row.FullName} có sinh nhật trong tháng này!`,
          date: row.DateOfBirth,
        });
      }

      const hireDate = new Date(row.HireDate);
      const hireMonth = hireDate.getMonth();
      const hireDay = hireDate.getDate();

      if (hireMonth === currentMonth && hireDay === currentDay) {
        const yearsWorked = currentDate.getFullYear() - hireDate.getFullYear();

        if (
          currentDate.getMonth() < hireMonth ||
          (currentDate.getMonth() === hireMonth &&
            currentDate.getDate() < hireDay)
        ) {
          yearsWorked--;
        }

        if (yearsWorked > 0) {
          allNotifications.push({
            type: "Kỷ niệm",
            message: `${row.FullName} kỷ niệm ${yearsWorked} năm làm việc tại công ty!`,
            date: row.HireDate,
          });
        }
      }
    });

    const query = `SELECT EmployeeID, SUM(LeaveDays) AS TotalLeave
  FROM attendance
  WHERE MONTH(attendanceDate) = ? AND YEAR(attendanceDate) = ?
  GROUP BY EmployeeID`;
    const queryParams = [currentMonth + 1, currentDate.getFullYear()];
    mysqlConnection.query(query, queryParams, (err, results) => {
      if (err) {
        console.error("Lỗi khi truy vấn MySQL:", err);
        return res.status(500).json({ error: "Lỗi MySQL" });
      }
      results.forEach((row) => {
        if (row.TotalLeave > 2) {
          const employee = sqlResults.recordset.find(
            (emp) => emp.EmployeeID === row.EmployeeID
          );
          if (employee) {
            allNotifications.push({
              type: "Cảnh báo",
              message: `${employee.FullName} đã nghỉ ${row.TotalLeave} ngày trong tháng này!`,
              date: new Date(),
            });
          }
        }
      });
      res.status(200).json({ notifications: allNotifications });
    });
  } catch (err) {
    console.error("Lỗi khi kết nối cơ sở dữ liệu:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

exports.getaccount = async (req, res) => {
  try {
    const query = `
      SELECT  
        e.FullName, 
        a.UserName,
        a.Password,
        r.RoleName
      FROM account a
      JOIN employees e ON a.EmployeeID = e.EmployeeID
      JOIN role r ON a.RoleID = r.RoleID
    `;

    mysqlConnection.query(query, (err, results) => {
      if (err) {
        console.error("Lỗi truy vấn:", err);
        return res.status(500).json({ message: "Lỗi truy vấn cơ sở dữ liệu" });
      }

      return res.status(200).json(results);
    });
  } catch (error) {
    console.error("Lỗi:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

exports.addAccount = (req, res) => {
  const { EmployeeID, RoleID, UserName, Password } = req.body;
  if (!EmployeeID || !RoleID || !UserName || !Password) {
    return res.status(400).json({ message: "Thiếu thông tin!" });
  }
  const checkQuery = `SELECT * FROM account WHERE EmployeeID = ?`;
  mysqlConnection.query(checkQuery, [EmployeeID], (err, result) => {
    if (err) {
      console.err("Lỗi kiểm tra tài khoản: ", err);
      return res.status(500).json({ message: "Lỗi server!" });
    }

    if (result.length > 0) {
      return res.status(409).json({ message: "Taì khoản đã tồn tại" });
    }

    const insertQuery = `INSERT INTO account (EmployeeID, RoleID, UserName, Password) VALUES (?,?,?,?)`;
    mysqlConnection.query(
      insertQuery,
      [EmployeeID, RoleID, UserName, Password],
      (err, result) => {
        if (err) {
          console.err("Lỗi thêm tài khoản: ", err);
          return res.status(500).json({ message: "Không thể thêm tài khoản" });
        }
        return res.status(200).json({ message: "Tạo tài khoản thành công" });
      }
    );
  });
};

exports.addTimekeeping = (req, res) => {
  const { employeeID, type, date } = req.body;

  if (!employeeID || !type || !date) {
    return res.status(400).json({ message: "Chưa đầy đủ thông tin." });
  }

  const today = new Date(date);
  const formattedDate = today.toISOString().split("T")[0];

  const checkQuery = `
    SELECT * FROM attendance WHERE EmployeeID = ? AND AttendanceDate = ?
  `;

  mysqlConnection.query(
    checkQuery,
    [employeeID, formattedDate],
    (err, results) => {
      if (err) {
        console.error("Lỗi khi kiểm tra dữ liệu:", err);
        return res.status(500).json({ message: "Lỗi kiểm tra dữ liệu" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "Đã chấm công hôm nay!" });
      }

      const newRecord = {
        EmployeeID: employeeID,
        AttendanceDate: formattedDate,
        WorkDay: 0,
        AbsentDay: 0,
        LeaveDay: 0,
      };

      if (type === "work") {
        newRecord.WorkDay = 1;
      } else if (type === "absent") {
        newRecord.AbsentDay = 1;
      } else if (type === "leave") {
        newRecord.LeaveDay = 1;
      } else {
        return res
          .status(400)
          .json({ message: "Loại chấm công không hợp lệ!" });
      }

      const insertQuery = `
      INSERT INTO attendance (EmployeeID, AttendanceDate , WorkDays, AbsentDays, LeaveDays)
      VALUES (?, ?, ?, ?, ?)
    `;

      mysqlConnection.query(
        insertQuery,
        [
          newRecord.EmployeeID,
          newRecord.AttendanceDate,
          newRecord.WorkDay,
          newRecord.AbsentDay,
          newRecord.LeaveDay,
        ],
        (err) => {
          if (err) {
            console.error("Lỗi khi thêm mới chấm công:", err);
            return res
              .status(500)
              .json({ message: "Lỗi khi thêm mới chấm công", error: err });
          }
          return res
            .status(200)
            .json({ message: "Chấm công thành công (tạo mới bản ghi)" });
        }
      );
    }
  );
};

exports.getAttendanceByEmployeeID = (req, res) => {
  const { employeeID } = req.query;
  if (!employeeID) {
    return res
      .status(400)
      .json({ message: "Thiếu Id để thực hiện lấy thông tin!" });
  }

  const getAttendanceByID = `SELECT 
      DATE_FORMAT(AttendanceDate, '%Y-%m') AS Month,
      SUM(WorkDays) AS TotalWorkDays,
      SUM(LeaveDays) AS TotalLeaveDays,
      SUM(AbsentDays) AS TotalAbsentDays
    FROM attendance
    WHERE EmployeeID = ?
    GROUP BY DATE_FORMAT(AttendanceDate, '%Y-%m')
    ORDER BY Month DESC`;
  mysqlConnection.query(getAttendanceByID, [employeeID], (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn dữ liệu: ", err);
      return res.status(500).json({ message: "Lỗi Server" });
    }
    return res.status(200).json(result);
  });
};

exports.getSalariById = (req, res) => {
  const { employeeID } = req.query;
  if (!employeeID) {
    return res
      .status(400)
      .json({ message: "Thiếu Id để thực hiện lấy thông tin!" });
  }
  const getSalariById = `SELECT SalaryMonth, NetSalary FROM salaries
    WHERE EmployeeID = ?
    ORDER BY SalaryMonth`;
  mysqlConnection.query(getSalariById, [employeeID], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi Server!" });
    }
    return res.status(200).json(result);
  });
};

exports.getAllAttendance = (req, res) => {
  const getAllAttendance = `SELECT 
      e.FullName ,
      DATE_FORMAT(a.AttendanceDate, '%Y-%m') AS Month,
      SUM(a.WorkDays) AS TotalWorkDays,
      SUM(a.LeaveDays) AS TotalLeaveDays,
      SUM(a.AbsentDays) AS TotalAbsentDays
    FROM attendance a
    JOIN employees e ON a.EmployeeID = e.EmployeeID
    GROUP BY e.FullName, DATE_FORMAT(a.AttendanceDate, '%Y-%m')`;
  mysqlConnection.query(getAllAttendance, (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn!", err);
      return res.status(500).json({ message: "Lỗi Server" });
    }
    return res.status(200).json(result);
  });
};
